<template>
    <div class="main-page">
      <!-- Navbar-ul fix -->
      <nav class="navbar">
        <div class="ml-4 mt-2 logo ">TravelS</div>
        <div class="nav-links">
          <button class="nav-button" @click="goToObjectives">Obiective</button>
          <button class="nav-button" @click="goToLogin"  v-if="!userStore.userData?.id">Devin-o membru</button>
          <div class=" nav-button" v-if="userStore.userData?.id" @click="router.push('/profile')">
        <div>{{ userStore.userData.userName }}</div>
      </div>
        </div>
      </nav>
  
      <!-- Conținutul paginii -->
      <div class="">
        <div class="content">
          <h1 class="title fadein animation-duration-1000 julee-regular">
            Descoperă România
          </h1>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  import { onBeforeMount, onBeforeUnmount } from "vue";
  import { useApplicationStore } from "../stores/aplicationStateStore";
  import { useUserStore } from "../stores/userStore";

  const userStore=useUserStore();
  const appStore = useApplicationStore();
  const router = useRouter();
  
  onBeforeMount(() => {
    appStore.onMainPage = true;
  });
  
  onBeforeUnmount(() => {
    appStore.onMainPage = false;
  });
  
  const goToObjectives = () => {
    router.push('/objectives'); // Înlocuiește cu numele rutei tale pentru pagina "Obiective"
  };
  
  const goToLogin = () => {
    router.push('/login'); // Înlocuiește cu numele rutei tale pentru pagina de conectare
  };
  </script>
  
  <style scoped>
  .main-page {
    height: 100vh;
    width: 100vw;
    background-image: url("../assets/local/vidraru.jpg");
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    color: white;
    text-align: center;
    position: relative;
  }
  
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0rem 2rem;
    z-index: 10;
  }
  
  .logo {
    font-size: 2rem;
    color: white;
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
  }
  .nav-button>div:hover{
    background-color: rgb(0, 0, 0);
    border-radius: 10px;
  }
  
  .nav-button:hover {
    color: #aac282; /* Schimbă culoarea la hover */
  }
  
  .overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    max-width: 800px;
  }
  
  .content {
    max-width: 700px;
    margin: auto;
  }
  
  .title {
    font-size: 4rem;
    margin-bottom: 1rem;
    margin-top: 21rem;
  }
  </style>
  