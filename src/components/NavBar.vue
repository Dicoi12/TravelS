<template>
  <div class="bg-transparent">
    <div class="flex justify-content-around align-items-center z-5">
      <div
        class="text-4xl text-black-alpha-90 cursor-pointer"
        @click="router.push('/')"
      >
        TravelS
      </div>
      <div class="text-2xl text-black-alpha-90">Despre</div>
      <div class="text-2xl text-black-alpha-90" @click="router.push('/objectives')">Obiective populare</div>
      <div class="text-2xl text-black-alpha-90">Experiente</div>
      <div class="text-2xl text-black-alpha-90">Itinerarii</div>
      <div
        class="text-2xl text-black-alpha-90"
        v-if="!userStore.userData?.id"
        @click="router.push('/login')"
      >
        Conecteaza-te
      </div>
      <div class="text-2xl text-black-alpha-90" v-if="userStore.userData?.id">
        {{ userStore.userData.userName }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
const userStore = useUserStore();
const router = useRouter();
</script>
<style scoped>
div {
  font-family: "Kaushan Script", cursive;
}
</style>
