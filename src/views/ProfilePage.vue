<template>
  <div class="profile-container">
    <!-- Meniu lateral -->
    <div class="sidebar">
      <div class="profile-info">
        <img 
          :src="'/default-avatar.png'" 
          class="avatar"
          alt="Profile picture"
        />
        <h2 class="username">{{ userStore.userData.userName }}</h2>
        <p class="email">{{ userStore.userData.email }}</p>
      </div>
      
      <ul class="menu">
        <li 
          v-for="item in menuItems" 
          :key="item.key" 
          @click="activeSection = item.key"
          :class="{ active: activeSection === item.key }"
        >
          <i :class="item.icon" class="menu-icon"></i>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </div>

    <!-- Conținut principal -->
    <div class="main-content">
      <!-- Secțiunea principală -->
      <div v-if="activeSection === 'main'" class="section">
        <h1 class="section-title">Profilul Meu</h1>
        <div class="info-grid">
          <div class="info-card">
            <h3>Informații Principale</h3>
            <p><span>Nume:</span> {{ userStore.userData.userName }}</p>
            <p><span>Email:</span> {{ userStore.userData.email }}</p>
            <p><span>Telefon:</span> {{ userStore.userData.phone }}</p>
            <button class="btn" @click="userStore.$reset()">Deconectare</button>
          </div>
          <div class="info-card">
            <h3>Statistici Cont</h3>
            <p><span>Membru din:</span> {{ formatDate(userStore.userData.createdAt || new Date()) }}</p>
            <p><span>Ultima actualizare:</span> {{ formatDate(userStore.userData.updatedAt || new Date()) }}</p>
          </div>
        </div>
      </div>

      <!-- Secțiunea de schimbare parolă -->
      <div v-if="activeSection === 'password'" class="section">
        <h1 class="section-title">Schimbare Parolă</h1>
        <div class="field">
          <label>Parola Actuală</label>
          <input type="password" v-model="currentPassword" class="input" />
        </div>
        <div class="field">
          <label>Parola Nouă</label>
          <input type="password" v-model="newPassword" class="input" />
        </div>
        <div class="field">
          <label>Confirmă Parola Nouă</label>
          <input type="password" v-model="confirmPassword" class="input" />
        </div>
        <button class="btn" @click="changePassword">Schimbă Parola</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const activeSection = ref('main');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const menuItems = [
  { key: 'main', label: 'Profilul Meu', icon: 'pi pi-user' },
  { key: 'password', label: 'Schimbare Parolă', icon: 'pi pi-lock' }
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('Parolele nu coincid!');
    return;
  }
  try {
  await userStore.changePassword(currentPassword.value,newPassword.value);
  } catch (error) {
    alert('A apărut o eroare!');
  }
}
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: 100vh;
  background-color: #1e1e2f;
  color: #ffffff;
}

.sidebar {
  width: 250px;
  background-color: #252539;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-info {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.username {
  font-size: 1.5rem;
  font-weight: bold;
}

.email {
  font-size: 0.9rem;
  color: #b3b3b3;
}

.menu {
  list-style: none;
  padding: 0;
  width: 100%;
}

.menu li {
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.menu li:hover {
  background-color: #3b3b5b;
}

.menu li.active {
  background-color: #4a4a6a;
}

.menu-icon {
  margin-right: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-card {
  background-color: #284e38;
  padding: 20px;
  border-radius: 8px;
}

.info-card h3 {
  margin-bottom: 10px;
}

.info-card p {
  margin: 5px 0;
}

.info-card span {
  font-weight: bold;
}

.field {
  margin-bottom: 15px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #1e1e2f;
  color: #ffffff;
}

.btn {
  background-color: #4a4a6a;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #3b3b5b;
}
</style>
