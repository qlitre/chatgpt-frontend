<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Message } from '../../../types/chat';

const route = useRoute();
const id = String(route.params.id);
const response = ref<Message[]>([]);
const drawer = ref(false);
const url = `http://localhost:8000/api/chat/conversations/${id}/messages/`;

onMounted(async () => {
    try {
        const res = await fetch(url);
        response.value = await res.json();
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    }
});

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
            <v-list>
                <v-list-item v-for="item in response" :key="item.id">
                    <!-- ボットのメッセージ -->
                    <v-card :text="item.message" variant="tonal" v-if="item.is_bot"></v-card>
                    <!-- ユーザーのメッセージ -->
                    <v-card :text="item.message" variant="outlined" v-if="!item.is_bot"></v-card>
                </v-list-item>
            </v-list>
        </v-main>
    </v-app>
</template>
<style scoped>
.bubble {
    padding: 10px 15px;
    border-radius: 15px;
    max-width: 70%;
    margin: 5px 0;
}

.bot-bubble {
    background-color: #e0e0e0;
    /* 灰色の背景 */
    border-top-left-radius: 3px;
    margin-right: auto;
}

.user-bubble {
    background-color: #1976d2;
    /* 青色の背景 */
    color: white;
    border-top-right-radius: 3px;
    margin-left: auto;
}
</style>
