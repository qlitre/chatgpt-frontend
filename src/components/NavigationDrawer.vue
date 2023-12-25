<script setup lang="ts">

const drawer = useDrawer()

</script>

<template>
    <v-navigation-drawer v-model="drawer" color="white">
        <div class="text-center sticky mt-2 pb-2">
            <v-btn prepend-icon="add" variant="outlined" color="primary" class="mt-4" width="200"
                href="/chat">新しいチャット</v-btn>
        </div>
        <v-divider class="mt-2 mb-2"></v-divider>
        <SidebarConversations />
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-list-item href="/chat/conversation" link title="一覧を見る"></v-list-item>
        <v-divider class="mt-2 mb-2"></v-divider>
        <template v-slot:append>
            <div class="mb-2">
                <UserMenu />
            </div>
        </template>
    </v-navigation-drawer>
</template>