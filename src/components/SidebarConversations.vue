<script setup lang="ts">

import type { Conversation } from '../types/chat';

const response = ref<Conversation[]>([]);

try {
    const res = await useGetConversationList();
    if (res) {
        response.value = res.results;
    }
} catch (error) {
    console.error("APIリクエストに失敗しました:", error);
}
/*
 * ルーティングパラメータが変更されたときに実行して更新
*/
const route = useRoute()
watch(() => route.params, async () => {
    try {
        const res = await useGetConversationList();
        if (res) {
            response.value = res.results;
        }
    } catch (error) {
        console.error("APIリクエストに失敗しました:", error);
    };
});

</script>
<template>
    <div>
        <v-list v-if="response.length > 0">
            <v-list-item v-for="item in response" :key="item.id" :href="`/chat/conversation/${item.id}`">
                <v-list-item-title>
                    {{ item.topic }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </div>
</template>