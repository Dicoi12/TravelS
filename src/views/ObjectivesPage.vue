<template>
  <div>
    <div class="filter-bar">
      <InputText
        v-model="objectiveStore.filter.name"
        placeholder="Caută obiectiv"
        class="filter-input"
      />
      <Dropdown
        v-model="objectiveStore.filter.typeId"
        :options="useObjectiveTypeStore().objectiveTypes"
        placeholder="Tip obiectiv"
        class="filter-input"
        optionLabel="name"
        showClear 
        optionValue="id"
      />
      <InputNumber
        v-model="objectiveStore.filter.minRating"
        :min="0"
        :max="5"
        placeholder="Rating minim"
        class="filter-input"
      />
      <InputNumber
        v-model="objectiveStore.filter.maxDistance"
        :min="1"
        placeholder="Distanță maximă (km)"
        class="filter-input"
      />
      <Button
        label="Aplică filtre"
        icon="pi pi-filter"
        @click="objectiveStore.getLocalObjectives"
      />
    </div>
    <div class="flex justify-content-between">
      <!-- <h1 class="text-white align-self-start ml-2">
        Cele mai importante obiective turistice:
      </h1> -->
      <div class="flex align-items-center gap-2" v-if="!locationAccessGranted">
        <i class="pi pi-map-marker text-white"></i>
        <h2 class="block md:hidden text-white mr-3">
          Vezi obiectivele din jurul tău
        </h2>
      </div>
    </div>
    <div class="grid-container fadein animation-duration-1000">
      <div
        v-for="(item, index) in objectiveStore.objectives"
        :key="index"
        class="card-container"
        @click="$router.push(`/objectives/${item.id}`)"
      >
        <div class="card-content text-white">
          <img
            :src="item.images ? item.images[0] : 'https://iili.io/JhUNTSs.jpg'"
            alt="objective image"
            class="image"
          />
          <div class="card-details">
            <h3 class="location">{{ item.name }}</h3>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-map-marker"></i>
              <h4>{{item.city}}</h4>
            </div>
            <p>{{ truncateDescription(item.description ?? "") }}</p>
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
import { ref, onBeforeMount } from "vue";
import { useObjectivesStore } from "../stores/objectivesStore";
import { useObjectiveTypeStore } from "../stores/objectiveTypeStore";

const objectiveStore = useObjectivesStore();

const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);
const locationAccessGranted = ref<boolean>(true);

const getUserLocation = async () => {
  if (navigator.geolocation) {
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        // objectiveStore.getLocalObjectives(latitude.value??1,longitude.value??1);
        locationAccessGranted.value = true;
        objectiveStore.filter.latitude = latitude.value;
        objectiveStore.filter.longitude = longitude.value;
        console.log("Latitudine:", latitude.value);
        console.log("Longitudine:", longitude.value);
      },
      (error) => {
        locationAccessGranted.value = false;
        console.error("Eroare la obținerea locației sau acces refuzat:", error);
      }
    );
  } else {
    console.error("Geolocația nu este suportată de acest browser.");
    locationAccessGranted.value = false;
  }
};
const truncateDescription = (
  description: string,
  maxLength: number = 180
): string => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
};

onBeforeMount(async () => {
  objectiveStore.filter.typeId = null;
  objectiveStore.filter.minRating = null;
  objectiveStore.filter.maxDistance = null;
  objectiveStore.filter.name = null;
  await getUserLocation();
  await objectiveStore.getLocalObjectives();
  await useObjectiveTypeStore().getObjectiveTypes();
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
  background-color: #666666;
  transition: transform 0.3s ease-in-out;
}

.card-container:hover {
  transform: scale(1.05);
}

.card-content {
  position: relative;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.card-container:hover .image {
  transform: scale(1.1);
}

.card-details {
  padding: 0.5rem;
  background-color: #666666;
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
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
  background: #333;
  padding: 1rem;
  border-radius: 8px;
}

.filter-input {
  flex: 1;
}
</style>
