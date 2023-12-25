<script setup lang="ts">
const searchDialog = useSearchModal();

const q = ref("");
function search() {
    // 全角スペースを半角スペースに変換
    q.value = q.value.replace(/　/g, " ");
    navigateTo(`/chat/conversation?q=${q.value}`)
    q.value = "";
    searchDialog.value = false;
}
</script>


<template>
    <v-dialog v-model="searchDialog" max-width="500px">
        <v-card>
            <v-card-title>
                検索
            </v-card-title>
            <v-card-text>
                <v-text-field v-model="q" label="キーワード" autofocus></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="searchDialog = false">キャンセル</v-btn>
                <v-btn color="blue darken-1" @click="search()">検索</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>