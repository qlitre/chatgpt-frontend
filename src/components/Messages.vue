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

const history = ref<Message[]>([]);
const prompt = ref("")
const loading = ref(false);
// ChatGPTと通信中かどうか
const isCommunicating = ref(false);

if (conversationID != undefined) {
    try {
        const res = await useGetMessageList(conversationID);
        if (res) {
            history.value = res;
        }
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
}

async function streamDisplay(streamMessage: string) {
    const lst = history.value.length - 1
    for (const s of streamMessage) {
        await new Promise(r => setTimeout(r, 10));
        history.value[lst].message += s;
    }
}

/**
 * 送信ボタンが押されたときに実行
 */
async function addPrompt() {
    // 会話IDがない場合は会話を作成
    if (conversationID == undefined) return createConversation()
    isCommunicating.value = true;
    const _prompt = prompt.value
    prompt.value = ""
    // promptの内容を追加
    try {
        const res = await useAddPrompt(conversationID, _prompt);
        if (res) {
            history.value.push(res);
        }
        prompt.value = "";
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
    // AIの返答を追加
    try {
        loading.value = true;
        const res = await useAddAiResponse(conversationID, _prompt);
        loading.value = false;
        if (res) {
            const streamMessage = res.message
            // 一旦空にして追加
            res["message"] = ""
            history.value.push(res);
            // streamで受け取った文字列を1文字ずつ表示
            await streamDisplay(streamMessage)
        }
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
    isCommunicating.value = false;
}

/**
 * 会話を作成する
 */
async function createConversation() {
    isCommunicating.value = true;
    try {
        const tmp = { is_bot: false, message: prompt.value }
        const _prompt = prompt.value
        prompt.value = ""
        history.value.push(tmp)
        loading.value = true;
        const res = await useAddConversation(_prompt);
        loading.value = false;
        if (res) {
            const streamMessage = res.new_ai_res.message
            // 一旦空にして追加
            const aiResponse = res.new_ai_res
            aiResponse["message"] = ""
            history.value.push(aiResponse);
            // streamで受け取った文字列を1文字ずつ表示
            await streamDisplay(streamMessage)
        }
        const topicId = res?.conversation.id
        await navigateTo(`/chat/conversation/${topicId}`, { replace: false });

    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
    isCommunicating.value = false;
}

/**
 * 送信ボタンが押せるかどうか
 */
function canSend() {
    if (prompt.value.length == 0) return false
    if (isCommunicating.value) return false
    if (/^\s*$/.test(prompt.value)) return false
    return true
}

</script>

<template>
    <v-container class="top-container">
        <v-list>
            <v-list-item v-for="item in history" :key="item.id">
                <!-- ボットのメッセージ -->
                <v-card :text="item.message" variant="tonal" v-if="item.is_bot"></v-card>
                <!-- ユーザーのメッセージ -->
                <v-card :text="item.message" variant="outlined" v-if="!item.is_bot"></v-card>
            </v-list-item>
            <v-progress-linear v-if="loading" class="mt-4" color="deep-purple-accent-4" indeterminate rounded
                height="6"></v-progress-linear>
        </v-list>
        <div class="prompt-box">
            <div class="input-wrapper">
                <v-textarea class="custom-textarea" v-model="prompt" auto-grow placeholder="メッセージを送信" rows="2"
                    bg-color="white" density="compact" variant="solo"></v-textarea>

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