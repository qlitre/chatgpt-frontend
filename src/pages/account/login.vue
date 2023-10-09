<script setup lang="ts">
definePageMeta({
  layout: false
});

import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
const authStore = useAuthStore();
const userStore = useUserStore();
const serverError = ref(false);
const password = ref('');
const email = ref('');
const submitLoginForm = async () => {
  const formData = {
    email: email.value,
    password: password.value,
  }
  const { data, pending, error, refresh } = await useAuthApi('login/', 'POST', formData)
  if (error.value) {
    serverError.value = error.value.data;
  }
  if (data.value) {
    serverError.value = null;
    authStore.setAuthenticated(true)
    const { data: user, pending, error } = await useAuthApi('user/')
    if (user.value) {
      userStore.setUser(user.value)
    }
    return navigateTo("/chat", { replace: true });
  }

};
</script>

<template>
  <v-container class="mt-32">
    <v-row justify="center">
      <v-col cols="12" md="4">
        <h1 class="text-center font-weight-bold mb-5">ログイン</h1>
        <v-form @submit.prevent="submitLoginForm" id="loginForm">
          <v-text-field v-model="email" label="Email" name="email" type="email" required
            :rules="[v => !!v || 'Eメールは必須です', v => /.+@.+/.test(v) || '有効なEメールアドレスを入力してください']" placeholder="Email"
            class="mb-2"></v-text-field>

          <v-text-field v-model="password" label="Password" name="password" type="password" required
            :rules="[v => !!v || 'パスワードは必須です']" placeholder="Password"></v-text-field>

          <div class="text-center mt-8">
            <v-btn block type="submit" color="primary">Login</v-btn>
          </div>
        </v-form>
        <div class="text-center mt-4">
          <a color="blue" href="/account/reset_password_request">
            パスワードをお忘れですか？
          </a>
        </div>
        <v-divider class="my-4"></v-divider>

        <div class="text-center">
          <v-btn color="blue" to="/account/register">会員登録</v-btn>
        </div>

        <v-alert v-if="serverError" type="error" class="mt-4">
          {{ serverError.detail }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped></style>
