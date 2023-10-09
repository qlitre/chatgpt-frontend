<script setup>
import { mergeProps } from 'vue'
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
const userStore = useUserStore();
const authStore = useAuthStore();
const onLogout = async () => {
    await useAuthApi('logout/', 'POST', '')
    authStore.setAuthenticated(false)
    authStore.$reset();
    userStore.$reset();
    await navigateTo("/account/login", { replace: true });
};
</script>
<template>
    <div class="text-center">
        <v-menu>
            <template v-slot:activator="{ props: menu }">
                <v-btn variant="outlined" v-bind="mergeProps(menu)" width="200">
                    USER MENU
                </v-btn>
            </template>
            <v-list>
                <v-list-item href="/chat/profile">
                    <v-list-item-title>
                        Profile
                    </v-list-item-title>
                </v-list-item>
                <v-list-item href="/chat/change_password">
                    <v-list-item-title>Change Password</v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <v-list-item-title @click="onLogout" class="cursor-pointer">Logout</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>