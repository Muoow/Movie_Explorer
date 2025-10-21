<script setup lang="ts">
import HeaderNavbar from "@/components/HeaderNavbar.vue";
</script>

<template>
  <div class="app">
    <div class="header-nav">
      <HeaderNavbar />
    </div>
    <div class="router-view">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100%;
}

.header-nav {
  width: 200px;
  height: 100%;
  position: fixed;
  background-color: #545c64
}

.router-view {
  width: calc(100vw - 200px);
  margin-left: 200px
}
</style>
