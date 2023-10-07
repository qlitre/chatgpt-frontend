<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Message } from '../../../types/chat';

const route = useRoute();
const id = String(route.params.id);
const response = ref<Message[]>([]);
const drawer = ref(false);
const url = `http://localhost:8000/api/chat/conversations/${id}/messages/`;
const prompt = ref("")

onMounted(async () => {
    try {
        const res = await fetch(url);
        response.value = await res.json();
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
});

async function addPrompt(msg: string) {
    const url = "http://localhost:8000/api/chat/conversations/1/messages/create/";
    const data = {
        "message": msg,
        "is_bot": false
    };

    try {
        // ユーザーメッセージをサーバに送信
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // ユーザーメッセージをローカルのリストに追加
        response.value.push(await res.json());
        prompt.value = "";
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }

    const aiData = {
        "message": msg,
        "is_bot": true
    };

    try {
        const aiUrl = "http://localhost:8000/api/chat/conversations/1/messages/get_ai_res/";
        const res = await fetch(aiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aiData),
        });
        const aiResponse = await res.json();
        const streamMessage = aiResponse["message"];
        aiResponse["message"] = "";
        response.value.push(aiResponse);

        // streamで受け取った文字列を1文字ずつ表示
        for (let i = 0; i < streamMessage.length; i++) {
            await new Promise(r => setTimeout(r, 10));
            response.value[response.value.length - 1].message += streamMessage[i];
        }
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
}
</script>

<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>ChatGPT APP</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container>

                <v-list>
                    <v-list-item v-for="item in response" :key="item.id">
                        <!-- ボットのメッセージ -->
                        <v-card :text="item.message" variant="tonal" v-if="item.is_bot"></v-card>
                        <!-- ユーザーのメッセージ -->
                        <v-card :text="item.message" variant="outlined" v-if="!item.is_bot"></v-card>
                    </v-list-item>
                </v-list>

                <v-textarea v-model="prompt" auto-grow counter label="テキストを入力" rows="2"></v-textarea>
                <v-btn variant="outlined" color="primary" block @click="addPrompt(prompt)">SEND</v-btn>
            </v-container>
        </v-main>
    </v-app>
</template>