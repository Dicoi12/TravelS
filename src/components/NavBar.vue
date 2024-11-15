<template>
  <div class="bg-transparent">
    <div class="flex justify-content-around align-items-center z-5 text-white">
      <div
        class="text-4xl text-white cursor-pointer navelement"
        @click="router.push('/')"
      >
        TravelS
      </div>
      <div
        class="text-2xl text-white navelement"
        @click="router.push('/objectives')"
      >
        Obiective populare
      </div>
      <div class="text-2xl text-white navelement">Experiente</div>
      <div class="text-2xl text-white navelement"  @click="router.push('/events')">Evenimente</div>
      <div class="text-2xl text-white navelement">Itinerarii</div>
      <div
        class="text-2xl text-white navelement"
        v-if="!userStore.userData?.id"
        @click="router.push('/login')"
      >
        Conecteaza-te
      </div>
      <div
        class="text-2xl text-white navelement"
        v-if="userStore.userData?.role == UserRoleEnum.Administrator"
        @click="router.push('/setup')"
      >
        Administrare
      </div>
      <div
      class="text-2xl text-white navelement flex gap-3"
      v-if="userStore.userData?.id"
      >
      <OverlayBadge :value="objectiveStore.favourites.length" @click="router.push('/favouriteObjectives')">
        <i class="pi pi-heart" style="font-size: 1.2rem" />
      </OverlayBadge>
        <div @click="router.push('/profile')">{{ userStore.userData.userName }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { UserRoleEnum } from "../Interfaces";
import { useObjectivesStore } from "../stores/objectivesStore";

const objectiveStore = useObjectivesStore();
const userStore = useUserStore();
const router = useRouter();
</script>
<style scoped>
div {
  font-family: "Kaushan Script", cursive;
}
.navelement {
  cursor: pointer;
}
</style>
