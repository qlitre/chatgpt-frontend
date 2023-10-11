<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Message } from '../../../types/chat';

const route = useRoute();
const conversationID = String(route.params.id);
const response = ref<Message[]>([]);
const prompt = ref("")
const loading = ref(false);
// ChatGPTと通信中かどうか
const isCommunicating = ref(false);

try {
    const res = await useGetMessageList(conversationID);
    if (res) {
        response.value = res;
    }
} catch (error) {
    console.error("APIリクエストに失敗しました:", error);
}

async function addPrompt() {
    isCommunicating.value = true;
    const _prompt = prompt.value
    prompt.value = ""
    // promptの内容を追加
    try {
        const res = await useAddPrompt(conversationID, _prompt);
        if (res) {
            response.value.push(res);
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
            response.value.push(res);
            // streamで受け取った文字列を1文字ずつ表示
            const lst = response.value.length - 1
            for (const s of streamMessage) {
                await new Promise(r => setTimeout(r, 25));
                response.value[lst].message += s;
            }
        }
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
    isCommunicating.value = false;
}

function canSend() {
    if (prompt.value.length == 0) return false
    if (isCommunicating.value) return false
    return true
}

</script>

<template>
    <v-container class="top-container">
        <v-list>
            <v-list-item v-for="item in response" :key="item.id">
                <!-- ボットのメッセージ -->
                <v-card :text="item.message" variant="tonal" v-if="item.is_bot"></v-card>
                <!-- ユーザーのメッセージ -->
                <v-card :text="item.message" variant="outlined" v-if="!item.is_bot"></v-card>
            </v-list-item>
            <v-progress-linear v-if="loading" class="mt-4" color="deep-purple-accent-4" indeterminate rounded
                height="6"></v-progress-linear>
        </v-list>
        <div class="prompt-box">
            <v-textarea v-model="prompt" auto-grow placeholder="メッセージを送信" rows="1" bg-color="white" density="compact"
                variant="solo" append-inner-icon="mdi-magnify"></v-textarea>
            <v-btn :disabled="!canSend()" class="abs" color="primary" @click="addPrompt()">SEND</v-btn>
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
</style>