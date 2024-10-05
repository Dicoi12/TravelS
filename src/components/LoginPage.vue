<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">Conectează-te</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Utilizator</label>
          <InputText v-model="username" placeholder="Enter your email" />
        </div>
        <div class="input-group">
          <label for="password">Parolă</label>
          <InputText
            v-model="password"
            type="password"
            id="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <label class="my-2 text-white font-xl">Crează un cont nou...</label>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";

const username = ref("");
const password = ref("");
const userStore = useUserStore();
async function handleLogin() {
  console.log("Logging in with:", username.value, password.value);
  let resp = await userStore.login(username.value, password.value);
  console.log(resp);
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("../assets/background-image.jpg"); /* Your background image path */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.1); /* Transparent card background */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px); /* Optional glass effect */
  width: 350px;
  max-width: 100%;
}

.login-title {
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}

.input-group input::placeholder {
  color: #888;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45a049;
}
</style>
