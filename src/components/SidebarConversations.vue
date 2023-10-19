<script setup lang="ts">

import type { Conversation } from '../types/chat';

const response = ref<Conversation[]>([]);
const params = { excludeFields: ['messages'] }
const res = await useGetConversationList(params);
if (res) {
    response.value = res.results;
}

/*
 * ルーティングパラメータが変更されたときに実行して更新
*/
const route = useRoute()
const id = route.params.id || ''
watch(() => route.params, async () => {
    const params = { excludeFields: ['messages'] }
    const res = await useGetConversationList(params);
    if (res) {
        response.value = res.results;
    }
});

</script>
<template>
    <div>
        <v-list v-if="response.length > 0">
            <v-list-item v-for="item in response" :key="item.id" :href="`/chat/conversation/${item.id}`"
                :class="{ active: String(item.id) === id }">
                <v-list-item-title>
                    {{ item.topic }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </div>
</template>

<style scoped>
.active {
    background-color: #E8EAF6;

}
</style>