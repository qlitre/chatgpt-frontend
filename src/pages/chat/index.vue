<script setup lang="ts">

definePageMeta({
    middleware: ["checkauth"],
});

</script>

<template>
    <Messages />
</template>