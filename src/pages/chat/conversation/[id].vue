<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Message } from '../../../types/chat';

const route = useRoute();
const conversationID = String(route.params.id);
const response = ref<Message[]>([]);
const prompt = ref("")
onMounted(async () => {
    try {
        const res = await useGetMessageList(conversationID);
        if (res) {
            response.value = res;
        }
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
});

async function addPrompt() {
    // promptの内容を追加
    try {
        const res = await useAddPrompt(conversationID, prompt.value);
        if (res) {
            response.value.push(res);
        }
        prompt.value = "";
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
    // AIの返答を追加
    try {
        const res = await useAddAiResponse(conversationID, prompt.value);
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