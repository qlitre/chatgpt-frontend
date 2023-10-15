<script setup lang="ts">
const drawer = ref(false);
const searchDialog = ref(false); // 検索ダイアログの状態を管理するrefを追加します
// 検索ボタンがクリックされた時に実行される関数
const openSearchModal = () => {
  searchDialog.value = true;
};

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
  <div>
    <v-app class="bg-blue-grey-lighten-5">
      <!-- sidebar-->
      <v-navigation-drawer v-model="drawer" color="white">
        <div class="text-center sticky mt-2 pb-2">
          <v-btn prepend-icon="add" variant="outlined" color="primary" class="mt-4" width="200" href="/chat">新しいチャット</v-btn>
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
      <!-- header -->
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>ChatGPT APP</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="openSearchModal">
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn href="/chat">Home</v-btn>
      </v-app-bar>
      <!-- ここから検索モーダルのコード -->
      <v-dialog v-model="searchDialog" max-width="500px">
        <v-card>
          <v-card-title>
            検索
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="q" label="キーワードを入力..." autofocus></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="searchDialog = false">キャンセル</v-btn>
            <v-btn color="blue darken-1" @click="search()">検索</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ここまで検索モーダルのコード -->
      <v-main>
        <slot />
      </v-main>
    </v-app>
  </div>
</template>