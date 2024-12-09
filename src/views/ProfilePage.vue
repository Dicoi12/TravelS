<template>
  <div class="flex">
    <!-- Meniu lateral -->
    <div class="w-64 surface-card min-h-screen p-4">
      <div class="flex flex-col items-center mb-8">
        <img 
          :src="userStore.userData.avatarUrl || '/default-avatar.png'" 
          class="w-24 h-24 rounded-full object-cover mb-4"
          alt="Profile picture"
        />
        <h2 class="text-white font-bold">{{ userStore.userData.userName }}</h2>
        <p class="text-gray-400">{{ userStore.userData.email }}</p>
      </div>
      
      <Menu class="w-full">
        <template #start>
          <MenuItem 
            v-for="item in menuItems" 
            :key="item.key"
            @click="activeSection = item.key"
            :class="{ 'bg-primary': activeSection === item.key }"
            class="hover:surface-hover"
          >
            <template #label>
              <i :class="item.icon" class="mr-2 text-white"></i>
              <span class="text-white">{{ item.label }}</span>
            </template>
          </MenuItem>
        </template>
      </Menu>
    </div>

    <!-- Conținut principal -->
    <div class="flex-1 p-6 surface-ground">
      <!-- Secțiunea principală -->
      <div v-if="activeSection === 'main'" class="max-w-3xl">
        <h1 class="text-3xl font-bold mb-6 text-white">Profilul Meu</h1>
        <div class="grid grid-cols-2 gap-6">
          <div class="surface-card p-4 rounded-lg">
            <h3 class="text-xl mb-4 text-white">Informații Principale</h3>
            <div class="space-y-2">
              <p class="text-gray-300"><span class="text-white font-bold">Nume:</span> {{ userStore.userData.fullName }}</p>
              <p class="text-gray-300"><span class="text-white font-bold">Email:</span> {{ userStore.userData.email }}</p>
              <p class="text-gray-300"><span class="text-white font-bold">Telefon:</span> {{ userStore.userData.phone }}</p>
              <p class="text-gray-300"><span class="text-white font-bold">Locație:</span> {{ userStore.userData.location }}</p>
            </div>
          </div>
          <div class="surface-card p-4 rounded-lg">
            <h3 class="text-xl mb-4 text-white">Statistici Cont</h3>
            <div class="space-y-2">
              <p class="text-gray-300"><span class="text-white font-bold">Membru din:</span> {{ formatDate(userStore.userData.createdAt) }}</p>
              <p class="text-gray-300"><span class="text-white font-bold">Ultima actualizare:</span> {{ formatDate(userStore.userData.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Secțiunea de editare profil -->
      <div v-if="activeSection === 'edit'" class="max-w-3xl">
        <h1 class="text-3xl font-bold mb-6">Editare Profil</h1>
        <div class="space-y-4">
          <div class="field">
            <label>Nume Complet</label>
            <InputText v-model="userStore.userData.fullName" class="w-full" />
          </div>
          <div class="field">
            <label>Telefon</label>
            <InputText v-model="userStore.userData.phone" class="w-full" />
          </div>
          <div class="field">
            <label>Locație</label>
            <InputText v-model="userStore.userData.location" class="w-full" />
          </div>
          <Button label="Salvează Modificările" @click="saveProfile" />
        </div>
      </div>

      <!-- Secțiunea de schimbare parolă -->
      <div v-if="activeSection === 'password'" class="max-w-3xl">
        <h1 class="text-3xl font-bold mb-6">Schimbare Parolă</h1>
        <div class="space-y-4">
          <div class="field">
            <label>Parola Actuală</label>
            <Password v-model="currentPassword" class="w-full" toggleMask />
          </div>
          <div class="field">
            <label>Parola Nouă</label>
            <Password v-model="newPassword" class="w-full" toggleMask />
          </div>
          <div class="field">
            <label>Confirmă Parola Nouă</label>
            <Password v-model="confirmPassword" class="w-full" toggleMask />
          </div>
          <Button label="Schimbă Parola" @click="changePassword" />
        </div>
      </div>

      <!-- Secțiunea de preferințe -->
      <div v-if="activeSection === 'preferences'" class="max-w-3xl">
        <h1 class="text-3xl font-bold mb-6">Preferințe</h1>
        <div class="space-y-4">
          <div class="field">
            <label>Limbă</label>
            <Dropdown v-model="userStore.userData.language" :options="languages" class="w-full" />
          </div>
          <div class="field">
            <label>Temă</label>
            <SelectButton v-model="userStore.userData.theme" :options="['Light', 'Dark']" />
          </div>
          <Button label="Salvează Preferințele" @click="savePreferences" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from "../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const activeSection = ref('main');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const menuItems = [
  { key: 'main', label: 'Profilul Meu', icon: 'pi pi-user' },
  { key: 'edit', label: 'Editare Profil', icon: 'pi pi-pencil' },
  { key: 'password', label: 'Schimbare Parolă', icon: 'pi pi-lock' },
  { key: 'preferences', label: 'Preferințe', icon: 'pi pi-cog' }
];

const languages = [
  { label: 'Română', value: 'ro' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' }
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

async function saveProfile() {
  try {
    await userStore.updateProfile();
    // Adăugați logica de salvare
  } catch (error) {
    // Gestionare erori
  }
}

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    // Afișați eroare
    return;
  }
  try {
    // Implementați logica de schimbare a parolei
  } catch (error) {
    // Gestionare erori
  }
}

async function savePreferences() {
  try {
    // Implementați logica de salvare a preferințelor
  } catch (error) {
    // Gestionare erori
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

:deep(.p-menuitem-link) {
  padding: 0.75rem 1rem !important;
  border-radius: 0.5rem !important;
  margin-bottom: 0.5rem !important;
  transition: all 0.2s ease-in-out !important;
}

:deep(.p-inputtext) {
  background-color: var(--surface-card) !important;
  border: 1px solid var(--surface-border) !important;
  color: var(--text-color) !important;
  border-radius: 0.5rem !important;
}

:deep(.p-button) {
  border-radius: 0.5rem !important;
}
</style>
