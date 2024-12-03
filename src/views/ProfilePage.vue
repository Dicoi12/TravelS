<template>
  <div class="flex gap-2">
    <i class="pi pi-user text-white" style="font-size: 2rem"></i>
    <h1 class="text-white">{{ userStore.userData.userName }}</h1>
    <Button label="Logout" @click="logout" />
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";
const userStore = useUserStore();
const router = useRouter();
function logout() {
  userStore.logout();
  router.push("/login");
}
</script>
