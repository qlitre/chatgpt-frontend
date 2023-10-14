<script setup lang="ts">

import type { ConversationListResponse } from '../../../types/chat';

const response = ref<ConversationListResponse>();
const route = useRoute();
const p = Number(route.query.page)?.valueOf() || 1;
const _q = (route.query.q != null) ? String(route.query.q) : "";
const q = ref(_q);
const page = ref(p);
try {
    const res = await useGetConversationList(p, q.value);
    if (res) {
        response.value = res;
    }
} catch (error) {
    console.error("APIリクエストに失敗しました:", error);
}

function paginationLink() {
    navigateTo(`/chat/conversation/?page=${page.value}&q=${q.value}`)
}

const search = () => {
    // 全角スペースを半角スペースに変換
    q.value = q.value.replace(/　/g, " ");
    navigateTo(`/chat/conversation/?page=1&q=${q.value}`)
}

// queryが変化した場合にページをリロードする
watch(() => route.query, () => location.reload())


</script>
<template>
    <v-container class="mt-4">
        <div class="mt-4 mb-4">
            <v-text-field v-model="q" density="compact" variant="solo" label="キーワード" append-inner-icon="search" single-line
                hide-details @click:append-inner="search()" @keyup.enter="search()"></v-text-field>
        </div>
        <v-row class="mt-8">
            <v-col cols="12" sm="6" md="6" v-for="conv in response?.results" :key="conv.id">
                <v-card class="mx-auto" max-width="540" height="auto" variant="outlined" color="indigo"
                    :href="`/chat/conversation/${conv.id}`">
                    <v-card-text>
                        <p class="text--primary">
                            {{ conv.topic }}
                        </p>
                    </v-card-text>
                    <v-card-actions>
                        <!-- アクションをここに追加 -->
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <div class="mt-8">
            <v-pagination v-model="page" :length="response?.totalPages" :total-visible="7" color="indigo"
                @click="paginationLink()"></v-pagination>
        </div>
    </v-container>
</template>