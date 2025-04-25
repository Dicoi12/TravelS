<template>
  <div class="bg-transparent">
    <div class="flex justify-between items-center p-4">
      <div class="flex align-items-center justify-content-between w-full">
        <div
          class="text-4xl text-white cursor-pointer"
          @click="router.push('/')"
      >
        TravelS
      </div>

      <div class="md:hidden">
        <i class="pi pi-bars text-white text-3xl cursor-pointer" @click="toggleMenu"></i>
      </div>
    </div>

    <div class="hidden md:flex md:items-center md:gap-6">
      <div
        class="text-2xl text-white navelement"
          @click="router.push('/objectives')"
        >
          Obiective populare
        </div>
        <div class="text-2xl text-white navelement" @click="router.push('/experiences')">Experiente</div>
        <div class="text-2xl text-white navelement" @click="router.push('/events')">Evenimente</div>
        <div class="text-2xl text-white navelement" @click="router.push('/itineraries')">Itinerarii</div>
        <div
          v-if="!userStore.userData?.id"
          class="text-2xl text-white navelement"
          @click="router.push('/login')"
        >
          Conecteaza-te
        </div>
        <div
          v-if="userStore.userData?.role == UserRoleEnum.Administrator"
          class="text-2xl text-white navelement"
          @click="router.push('/setup')"
        >
          Administrare
        </div>
        <div
          v-if="userStore.userData?.id"
          class="text-2xl text-white navelement flex gap-3"
        >
          <div @click="router.push('/profile')">{{ userStore.userData.userName }}</div>
        </div>
      </div>
    </div>

    <!-- Meniul pentru mobile - vizibil doar când este deschis -->
    <div 
      v-if="isMobileMenuOpen"
      class="md:hidden flex flex-col bg-black bg-opacity-80"
    >
      <div
        class="text-2xl text-white navelement p-3"
        @click="() => { router.push('/objectives'); closeMenu(); }"
      >
        Obiective populare
      </div>
      <div class="text-2xl text-white navelement p-3">Experiente</div>
      <div 
        class="text-2xl text-white navelement p-3"
        @click="() => { router.push('/events'); closeMenu(); }"
      >
        Evenimente
      </div>
      <div class="text-2xl text-white navelement p-3">Itinerarii</div>
      <div
        v-if="!userStore.userData?.id"
        class="text-2xl text-white navelement p-3"
        @click="() => { router.push('/login'); closeMenu(); }"
      >
        Conecteaza-te
      </div>
      <div
        v-if="userStore.userData?.role == UserRoleEnum.Administrator"
        class="text-2xl text-white navelement p-3"
        @click="() => { router.push('/setup'); closeMenu(); }"
      >
        Administrare
      </div>
      <div
        v-if="userStore.userData?.id"
        class="text-2xl text-white navelement p-3 flex gap-3"
      >
        <div @click="() => { router.push('/profile'); closeMenu(); }">
          {{ userStore.userData.userName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { UserRoleEnum } from "../Interfaces";
import { ref } from 'vue';

const userStore = useUserStore();
const router = useRouter();

const isMobileMenuOpen = ref(false);
function toggleMenu() {
  console.log("toggleMenu");
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
function closeMenu() {
  isMobileMenuOpen.value = false;
}
</script>
<style scoped>
div {
  font-family: "Kaushan Script", cursive;
}
.navelement {
  cursor: pointer;
  flex: 1;
  text-align: center;
}

@media (max-width: 768px) {
  .navelement {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
