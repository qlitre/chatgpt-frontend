<script setup lang="ts">

const drawer = useDrawer()
const searchDialog = useSearchModal();

</script>

<template>
    <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>OpenAI Chat APP</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="searchDialog = true">
            <v-icon>search</v-icon>
        </v-btn>
        <v-btn href="/chat">Home</v-btn>
    </v-app-bar>
</template>