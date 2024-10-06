<template>
  <div class="w-full h-full">
    <Toast />
    <NavBar />
    <div class="bg-image">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.bg-image {
  background-image: url("../assets/local/transfagarasan-2544947_1920.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
}
</style>
