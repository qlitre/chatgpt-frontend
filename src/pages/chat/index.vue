<script setup lang="ts">
import type { Message } from '../../types/chat';

definePageMeta({
    middleware: ["checkauth"],
});

const response = ref<Message[]>([]);
const prompt = ref("")
async function addPrompt() {
    try {
        const res = await useAddConversation(prompt.value);
        if (res) {
            const newMessage = res.new_prompt
            response.value.push(newMessage)
            const streamMessage = res.new_ai_res.message
            // 一旦空にして追加
            const aiResponse = res.new_ai_res
            aiResponse["message"] = ""
            response.value.push(aiResponse);
            // streamで受け取った文字列を1文字ずつ表示
            const lst = response.value.length - 1
            for (const s of streamMessage) {
                await new Promise(r => setTimeout(r, 25));
                response.value[lst].message += s;
            }
        }
        prompt.value = "";
        const topicId = res?.conversation.id
        await navigateTo(`/chat/conversation/${topicId}`, { replace: false });

    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
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
        </v-list>
        <div class="prompt-box">
            <v-textarea v-model="prompt" auto-grow placeholder="メッセージを送信" rows="1" bg-color="white" density="compact"
                variant="solo" append-inner-icon="mdi-send"></v-textarea>
            <v-btn :disabled="!prompt" class="abs" color="primary" @click="addPrompt()">SEND</v-btn>
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