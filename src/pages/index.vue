<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Conversation } from '../types/chat';

const url = 'http://localhost:8000/api/chat/conversations/';
const response = ref<Conversation[]>([]);
const drawer = ref(false);
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
            <v-list>
                <v-list-item v-for="item in response" :key="item.id">
                    <v-list-item-content>
                        <v-list-item-title>
                            <NuxtLink :to="`/message/${item.id}`">{{ item.topic }}</NuxtLink>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>ChatGPT APP</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <!--  -->
        </v-main>
    </v-app>
</template>
