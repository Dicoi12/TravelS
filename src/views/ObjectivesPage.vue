<template>
  <div>
    <h1 class="text-white align-self-start ml-2">
      Cele mai importante obiective turistice:
    </h1>
    <div class="grid-container fadein animation-duration-1000">
      <div
        v-for="(item, index) in objectiveStore.objectives"
        :key="index"
        class="card-container"
      >
        <div class="card-content text-white">
          <img :src="item.images[0]" alt="objective image" class="image" />
          <div class="card-details">
            <h3 class="location">{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <Button class="favorite-button">
            <i class="pi pi-heart"></i>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useObjectivesStore } from "../stores/objectivesStore";
import { onBeforeMount } from "vue";

const objectiveStore = useObjectivesStore();
onBeforeMount(async () => {
  await objectiveStore.getObjectives();
});
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-around;
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 1rem;
  scrollbar-width: thin;
}

.grid-container::-webkit-scrollbar {
  width: 8px;
}

.grid-container::-webkit-scrollbar-thumb {
  background-color: #030303;
  border-radius: 10px;
}

.card-container {
  position: relative;
  width: 300px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #666666; /* Gri pe întregul card */
  transition: transform 0.3s ease-in-out;
}

.card-container:hover {
  transform: scale(1.05); /* Zoom-in la hover */
}

.card-content {
  position: relative;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out; /* Tranziție pentru zoom */
}

.card-container:hover .image {
  transform: scale(1.1); /* Zoom-in pe imagine la hover */
}

.card-details {
  padding: 0.5rem;
  background-color: #666666; /* Gri translucid */
  color: white;
}

.location {
  font-size: 1.25rem;
  font-weight: bold;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.favorite-button .pi-heart {
  color: white;
}

.favorite-button:hover .pi-heart {
  color: red;
}
</style>
