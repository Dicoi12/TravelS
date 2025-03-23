<template>
  <div class="layout">
    <!-- Include NavBar aici pentru a fi afișat pe toate paginile -->
    <NavBar v-if="appStore.onMainPage == false" />

    <div class="content">
      <router-view v-slot="{ Component }" class="fadein animation-duration-300">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApplicationStore } from "../stores/aplicationStateStore";
import NavBar from "../components/NavBar.vue";
const appStore = useApplicationStore();
</script>

<style scoped>
.layout {
  background-color: #36453b;
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; 
  width: 100vw; 
  display: flex;
  flex-direction: column; 
  overflow: hidden; 
}

.content {  
  overflow: auto; 
  height: 100%; 
}
</style>
