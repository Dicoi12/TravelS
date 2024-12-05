<template>
  <div class="bg-transparent">
    <!-- Buton hamburger pentru mobile -->
    <div class="md:hidden flex justify-end p-4">
      <i class="pi pi-bars text-white text-3xl cursor-pointer" @click="toggleMenu"></i>
    </div>

    <!-- Meniul principal -->
    <div 
      :class="[
        'flex z-5 text-white',
        'md:justify-content-around md:align-items-center',
        'flex-column md:flex-row',
        isMobileMenuOpen ? 'flex' : 'hidden md:flex',
        'bg-black bg-opacity-80 md:bg-transparent'
      ]"
    >
      <div
        class="text-4xl text-white cursor-pointer navelement p-3 md:p-0"
        @click="router.push('/')"
      >
        TravelS
      </div>
      <div
        class="text-2xl text-white navelement p-3 md:p-0"
        @click="router.push('/objectives')"
      >
        Obiective populare
      </div>
      <div class="text-2xl text-white navelement p-3 md:p-0">Experiente</div>
      <div class="text-2xl text-white navelement p-3 md:p-0"  @click="router.push('/events')">Evenimente</div>
      <div class="text-2xl text-white navelement p-3 md:p-0">Itinerarii</div>
      <div
        class="text-2xl text-white navelement p-3 md:p-0"
        v-if="!userStore.userData?.id"
        @click="router.push('/login')"
      >
        Conecteaza-te
      </div>
      <div
        class="text-2xl text-white navelement p-3 md:p-0"
        v-if="userStore.userData?.role == UserRoleEnum.Administrator"
        @click="router.push('/setup')"
      >
        Administrare
      </div>
      <div
      class="text-2xl text-white navelement p-3 md:p-0 flex gap-3"
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
import { ref } from 'vue';

const objectiveStore = useObjectivesStore();
const userStore = useUserStore();
const router = useRouter();

const isMobileMenuOpen = ref(false);
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>
<style scoped>
div {
  font-family: "Kaushan Script", cursive;
}
.navelement {
  cursor: pointer;
}

@media (max-width: 768px) {
  .navelement {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
