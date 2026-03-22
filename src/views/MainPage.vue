<template>
  <div class="main-page">
    <nav class="navbar">
      <div class="ml-4 mt-2 logo">TravelS</div>
      <div class="nav-links">
        <button class="nav-button" @click="goToObjectives">Obiective</button>
        <button class="nav-button" @click="goToLogin" v-if="!userStore.userData?.id">Devin-o membru</button>
        <div class="nav-button" v-if="userStore.userData?.id" @click="router.push('/profile')">
          <div>{{ userStore.userData.userName }}</div>
        </div>
      </div>
    </nav>

    <div class="overlay"></div>
    <div class="hero-content">
      <h1 class="title fadein animation-duration-1000 julee-regular">
        Descoperă România
      </h1>
      <p class="subtitle fadein animation-duration-1000">
        Obiective turistice, experiențe și itinerarii personalizate
      </p>
      <div class="cta-buttons fadein animation-duration-1000">
        <button class="cta-primary" @click="goToObjectives">Explorează obiective</button>
        <button class="cta-secondary" @click="goToLogin" v-if="!userStore.userData?.id">Devin-o membru</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useApplicationStore } from "../stores/aplicationStateStore";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const appStore = useApplicationStore();
const router = useRouter();

onBeforeMount(() => {
  appStore.onMainPage = true;
});

onBeforeUnmount(() => {
  appStore.onMainPage = false;
});

const goToObjectives = () => {
  router.push('/objectives');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.main-page {
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/local/sibiu2.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0.55) 100%
  );
  pointer-events: none;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  z-index: 10;
  background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%);
}

.logo {
  font-size: 2rem;
  color: white;
  font-family: "Kaushan Script", cursive;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-button {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0.3rem;
  font-family: "Kaushan Script", cursive;
}

.nav-button:hover {
  color: #aac282;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 0 1rem;
}

.title {
  font-size: 4.5rem;
  color: white;
  text-shadow: 2px 4px 12px rgba(0, 0, 0, 0.6);
  margin: 0;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.88);
  text-shadow: 1px 2px 6px rgba(0, 0, 0, 0.5);
  margin: 0;
  max-width: 480px;
  font-family: sans-serif;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-primary {
  padding: 0.8rem 2rem;
  background-color: #4a7c59;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  letter-spacing: 0.03em;
}

.cta-primary:hover {
  background-color: #3a6347;
  transform: translateY(-2px);
}

.cta-secondary {
  padding: 0.8rem 2rem;
  background-color: transparent;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.75);
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, transform 0.2s;
  letter-spacing: 0.03em;
}

.cta-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: white;
  transform: translateY(-2px);
}
</style>
