<script setup lang="ts">

const route = useRoute();
const conversationID = String(route.params.id);

</script>

<template>
    <MessagesWithHistory :conversationID="conversationID" />
</template>