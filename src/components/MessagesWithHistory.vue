<script setup lang="ts">

import type { Message } from '../types/chat';
import { parseChunkToJsonArray } from '../utils/parseChunkToJsonArray';
import { yieldCharWithDelay } from '../utils/yieldCharWithDelay';
import { mdRenderer } from '../utils/mdRenderer';

type Props = {
    conversationID: string;
}

const { conversationID } = defineProps<Props>()

const history = ref<Message[]>([]);
const prompt = ref("")
// ChatGPTと通信中かどうか
const isCommunicating = ref(false);
const loading = ref(false);

const conversationDetail = await useGetConvesationDetail(conversationID);
if (conversationDetail) {
    history.value = conversationDetail.messages;
}

/**
 * 送信ボタンが押されたときに実行
 */
async function addPrompt() {
    if (!canSend()) return
    history.value.push({ is_bot: false, message: prompt.value })
    const _prompt = prompt.value
    prompt.value = ""
    loading.value = true;
    isCommunicating.value = true
    try {
        const response = await useGetStreamChatWithHistory(_prompt, conversationID);
        if (response.body == null) return
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        loading.value = false;
        history.value.push({ is_bot: true, message: '' })
        const lstIndex = history.value.length - 1
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            // chunk dataが２つ以上で送られてくる場合があるので、{}で分割する
            const jsonArr = parseChunkToJsonArray(chunk)
            // 1文字ずつ追加する
            for await (const char of yieldCharWithDelay(jsonArr)) {
                await new Promise(r => setTimeout(r, 25));
                history.value[lstIndex].message += char
            }
            scrollChatWindow()
        }
        // aiのメッセージを保存
        const res = await useAddMessage(conversationID, history.value[lstIndex].message, true)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    isCommunicating.value = false
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

const grab = ref(null)
const scrollChatWindow = () => {
    if (grab.value === null) {
        return;
    }
    grab.value.scrollIntoView({ behavior: 'smooth' })
}

</script>

<template>
    <v-container class="top-container">
        <v-container class="pa-4 justify-center" v-for="item in history" :key="item.id">
            <v-card class="pt-4">
                <div class="chip">
                    <v-chip prepend-icon="lightbulb_outline" v-if="item.is_bot" color="green" text-color="white">
                        # AI Response
                    </v-chip>
                    <v-chip prepend-icon="account_circle" v-else color="blue" text-color="white">
                        # Your Prompt
                    </v-chip>
                </div>
                <div v-html="mdRenderer(item.message)" class="md" />
            </v-card>
        </v-container>
        <v-progress-linear v-if="loading" class="mt-4" color="deep-purple-accent-4" indeterminate rounded
            height="6"></v-progress-linear>
        <div class="prompt-box">
            <div class="input-wrapper">
                <v-textarea class="textarea custom-textarea" v-model="prompt" auto-grow placeholder="メッセージを送信" rows="2"
                    max-rows="7" bg-color="white" density="compact" variant="solo"
                    @keyup.enter="handleEnterPress"></v-textarea>
                <v-btn size="small" :disabled="!canSend()" icon="send" class="send-button" color="primary"
                    @click="addPrompt()"></v-btn>
            </div>
        </div>
    </v-container>
    <div ref="grab" class="w-100"></div>
</template>

<style scoped lang="scss">
@import '../assets/scss/md.scss';

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
    overflow: auto;
}

.send-button {
    position: absolute;
    bottom: 30px;
    /* adjust this value to vertically center the button */
    right: 8px;
    /* adjust this value based on the desired position from the right edge */
}


.chip {
    padding: 0 4%;
}
</style>