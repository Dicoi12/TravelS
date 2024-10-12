<template>
  <div class="bg-image">
    <!-- Include NavBar aici pentru a fi afișat pe toate paginile -->
    <NavBar />

    <main >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
</script>

<style scoped>
.bg-image {
  /* background-image: url("../assets/local/transfagarasan-2544947_1920.jpg"); */
  background-color: #36453B;
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
}
</style>
