<script setup lang="ts">

definePageMeta({
  layout: false
});

const isSuccess: Ref<boolean> = ref(false);
const serverError: Ref<boolean | null> = ref(false);
const onAccountActivation = async () => {
  const { params } = useRoute()
  const { data, pending, error, refresh } = await useAuthApi('activate/', 'POST', params)
  if (error.value) {
    isSuccess.value = false;
    serverError.value = error.value.data;
  }
  if (data.value) {
    isSuccess.value = true;
    serverError.value = null;
    setTimeout(() => {
      return navigateTo("/account/login", { replace: true });
    }, 5000);
  }
};
</script>

<template>
  <v-container class="mt-32">
    <v-row class="justify-center">
      <v-col cols="12" md="6" lg="4">
        <div class="text-center">
          <h1 class="text-center font-weight-bold mb-5">アカウント有効化</h1>
          <p class="mb-4">下のボタンを押して有効化してください</p>
          <v-btn @click="onAccountActivation" type="submit">
            有効化
          </v-btn>
        </div>

        <v-alert v-if="serverError" type="error" dense class="mt-2" variant="tonal">
          {{ serverError.detail }}
        </v-alert>
        <v-alert v-if="isSuccess" type="success" dense class="mt-2" variant="tonal">
          アカウント登録が完了しました。5秒後にログインページに移動します。
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>