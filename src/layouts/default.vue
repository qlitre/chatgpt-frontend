<script setup>

const drawer = ref(false);

</script>

<template>
  <v-app>
    <!-- sidebar-->
    <v-navigation-drawer v-model="drawer" color="grey-darken-4">
      <div class="text-center sticky mt-2">
        <v-btn variant="outlined" color="white" class="mt-4" width="200" href="/chat">新しいチャット</v-btn>
      </div>
      <v-divider></v-divider>
      <Conversations />
      <template v-slot:append>
        <div class="mb-2">
          <UserMenu />
        </div>
      </template>
    </v-navigation-drawer>
    <!-- header -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>ChatGPT APP</v-app-bar-title>
      <v-spacer></v-spacer>
      <!--homeの追加-->
      <v-btn href="/chat" text>Home</v-btn>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>