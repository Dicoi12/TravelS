<template>
  <div class="layout">
    <!-- Include NavBar aici pentru a fi afișat pe toate paginile -->
    <NavBar />

    <main class="content">
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
/* Stilul principal pentru layout */
.layout {
  background-color: #36453B;
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; /* Setează înălțimea la 100% din viewport */
  width: 100vw;  /* Setează lățimea la 100% din viewport */
  display: flex;
  flex-direction: column; /* Aliniază NavBar și content pe verticală */
  overflow: hidden; /* Elimină scroll-ul pentru întreaga pagină */
}

.content {
  flex: 1; /* Face ca secțiunea main să ocupe restul ecranului */
  overflow: auto; /* Permite scroll doar în secțiunea content dacă e nevoie */
  height: 100%; /* Asigură-te că secțiunea main ocupă întregul spațiu disponibil */
}
</style>
