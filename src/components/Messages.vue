<script setup lang="ts">

/**
 * トップページと会話詳細ページから呼び出される
 * 会話IDがあるかないかで処理を分岐。
 * もっといいやり方もありそう
 */

import type { Message } from '../types/chat';

type Props = {
    conversationID?: string;
}

const { conversationID } = defineProps<Props>()
const newTopicId = ref()
const canNavigate = ref(false)
// 子コンポーネントのdisplayEndイベントを受け取ったときに実行
const displayEnd = (): void => {
    canNavigate.value = true;
}

type ExtendedMessage = Message & {
    isRecentAI?: boolean;
};
const history = ref<ExtendedMessage[]>([]);
const prompt = ref("")
const loading = ref(false);
// ChatGPTと通信中かどうか
const isCommunicating = ref(false);

if (conversationID != undefined) {
    const conversationDetail = await useGetConvesationDetail(conversationID);
    if (conversationDetail) {
        history.value = conversationDetail.messages;
    }
}

/**
 * 送信ボタンが押されたときに実行
 */
async function addPrompt() {
    if (!canSend()) return
    // 会話IDがない場合は会話を作成
    if (conversationID == undefined) return createConversation()

    isCommunicating.value = true;
    const _prompt = prompt.value
    prompt.value = ""
    // promptの内容を追加
    const res = await useAddPrompt(conversationID, _prompt);
    if (res) {
        history.value.push(res);
    }
    prompt.value = "";
    // AIの返答を追加
    loading.value = true;
    const aiRes = await useAddAiResponse(conversationID, _prompt);
    loading.value = false;
    if (aiRes) {
        const obj: ExtendedMessage = aiRes
        obj["isRecentAI"] = true
        history.value.push(obj);
    }
    isCommunicating.value = false;
}

/**
 * 会話を作成する
 */
async function createConversation() {
    isCommunicating.value = true;
    const tmp = { is_bot: false, message: prompt.value }
    const _prompt = prompt.value
    prompt.value = ""
    history.value.push(tmp)
    loading.value = true;
    const res = await useAddConversation(_prompt);
    loading.value = false;
    if (res) {
        const aiResponse: ExtendedMessage = res.new_ai_res
        aiResponse["isRecentAI"] = true
        history.value.push(aiResponse);
    }
    newTopicId.value = res?.conversation.id
    isCommunicating.value = false;

}

/**
 * Enterキーが単体で押されたときにチャットメッセージを送信
 * Shift + Enterの場合は改行
 */
function handleEnterPress(event: KeyboardEvent) {
    if (!event.shiftKey) {
        addPrompt();
        event.preventDefault();
    }
}

/**
 * 送信できるかどうかを制御
 */
function canSend() {
    if (prompt.value.length == 0) return false
    if (isCommunicating.value) return false
    if (/^\s*$/.test(prompt.value)) return false
    return true
}

const unwatch = watch(canNavigate, async (newValue) => {
    // canNavigateがtrueになったら、ナビゲーション処理を実行
    if (newValue) {
        // 新規作成の時のみナビゲーションを実行
        if (newTopicId.value == undefined) return
        navigateTo(`/chat/conversation/${newTopicId.value}`);
    }
});

// コンポーネントのアンマウント時にウォッチャをクリーンアップ
onUnmounted(() => {
    unwatch();
});

</script>

<template>
    <v-container class="top-container">
        <MessageContent v-for="item in history" :key="item.id" :is-bot="item.is_bot" :text="item.message"
            :isRecentAI="item.isRecentAI" @display-end="displayEnd()"></MessageContent>
        <v-progress-linear v-if="loading" class="mt-4" color="deep-purple-accent-4" indeterminate rounded
            height="6"></v-progress-linear>
        <div class="prompt-box">
            <div class="input-wrapper">
                <v-textarea class="custom-textarea" v-model="prompt" auto-grow placeholder="メッセージを送信" rows="2"
                    bg-color="white" density="compact" variant="solo" @keyup.enter="handleEnterPress"></v-textarea>

                <v-btn size="small" :disabled="!canSend()" icon="send" class="send-button" color="primary"
                    @click="addPrompt()"></v-btn>
            </div>
        </div>
    </v-container>
</template>

<style scoped>
.top-container {
    position: relative;
}

.prompt-box {
    padding-top: 30px;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
}

.input-wrapper {
    position: relative;
}

.custom-textarea {
    width: 100%;
    box-sizing: border-box;
}

.send-button {
    position: absolute;
    bottom: 30px;
    /* adjust this value to vertically center the button */
    right: 8px;
    /* adjust this value based on the desired position from the right edge */
}
</style>