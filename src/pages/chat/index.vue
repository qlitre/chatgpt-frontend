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
    <v-container>
        <v-list>
            <v-list-item v-for="item in response" :key="item.id">
                <!-- ボットのメッセージ -->
                <v-card :text="item.message" variant="tonal" v-if="item.is_bot"></v-card>
                <!-- ユーザーのメッセージ -->
                <v-card :text="item.message" variant="outlined" v-if="!item.is_bot"></v-card>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-textarea v-model="prompt" auto-grow label="テキストを入力" rows="2" class="custom-textarea"></v-textarea>
        <v-btn :disabled="!prompt" variant="outlined" color="primary" @click="addPrompt()" class="inside-btn">SEND</v-btn>
    </v-container>
</template>