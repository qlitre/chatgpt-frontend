<template>
  <div>
    <v-app class="bg-blue-grey-lighten-5">
      <!-- sidebar-->
      <NavigationDrawer />
      <!-- header -->
      <Header />
      <!-- 検索モーダル -->
      <SearchModal />
      <v-main>
        <slot />
      </v-main>
    </v-app>
  </div>
</template>