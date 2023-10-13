<script setup lang="ts">

const route = useRoute();
const conversationID = String(route.params.id);

</script>

<template>
    <Messages :conversationID="conversationID" />
</template>