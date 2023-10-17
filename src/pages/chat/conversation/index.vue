<script setup lang="ts">

import type { ConversationListResponse, ConversationListParams } from '../../../types/chat';

const response = ref<ConversationListResponse>();
const route = useRoute();
const p = Number(route.query.page)?.valueOf() || 1;
const _q = (route.query.q != null) ? String(route.query.q) : "";
const q = ref(_q);
const page = ref(p);
const params = { page: p, q: _q }
const res = await useGetConversationList(params);
if (res) {
    response.value = res;
}
function paginationLink() {
    navigateTo(`/chat/conversation/?page=${page.value}&q=${q.value}`)
}

const search = () => {
    if (q.value.trim() == "") return
    // 全角スペースを半角スペースに変換
    q.value = q.value.replace(/　/g, " ");
    navigateTo(`/chat/conversation/?page=1&q=${q.value}`)
}

const recentMsg: Record<number, string> = {};

if (response.value?.results) {
    for (const conv of response?.value.results) {
        const arr = conv.messages;
        let s = arr[arr.length - 1].message;
        if (s.length > 50) s = s.slice(0, 50) + "..."
        recentMsg[conv.id] = s;
    }
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
                <v-card class="mx-auto" height="150" max-width="540" variant="outlined" color="indigo"
                    :href="`/chat/conversation/${conv.id}`">
                    <v-card-title>
                        {{ conv.topic }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ conv.created_at }}
                    </v-card-subtitle>
                    <v-card-text>
                        {{ recentMsg[conv.id] }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <div class="mt-8">
            <v-pagination v-model="page" :length="response?.totalPages" :total-visible="7" color="indigo"
                @click="paginationLink()"></v-pagination>
        </div>
    </v-container>
</template>