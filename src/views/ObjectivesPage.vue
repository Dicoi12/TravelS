<template>
  <div>
    <div class="flex justify-content-between mt-4">
    <h1 class="text-white">Obiective populare: </h1>
    <div class="filter-header">
      <Button
        label="Filtre"
        icon="pi pi-filter"
        @click="showFilterDialog = true"
        class="p-button-rounded"
      />
    </div>
    </div>
    <Dialog
      v-model:visible="showFilterDialog"
      header="Filtre Obiective"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <div class="filter-dialog-content">
        <div class="filter-group">
          <label>Caută obiectiv</label>
          <InputText
            v-model="objectiveStore.filter.name"
            placeholder="Caută obiectiv"
            class="w-full"
          />
        </div>

        <div class="filter-group">
          <label>Tip obiectiv</label>
          <Dropdown
            v-model="objectiveStore.filter.typeId"
            :options="useObjectiveTypeStore().objectiveTypes"
            placeholder="Tip obiectiv"
            class="w-full"
            optionLabel="name"
            showClear 
            optionValue="id"
            filter
          />
        </div>

        <div class="filter-group">
          <label>Rating minim</label>
          <InputNumber
            v-model="objectiveStore.filter.minRating"
            :min="0"
            :max="5"
            placeholder="Rating minim"
            class="w-full"
          />
        </div>

        <div class="filter-group">
          <label>Distanță maximă (km)</label>
          <InputNumber
            v-model="objectiveStore.filter.maxDistance"
            :min="1"
            placeholder="Distanță maximă"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button
            label="Resetează"
            icon="pi pi-filter-slash"
            @click="resetFilters"
            class="p-button-outlined"
          />
          <Button
            label="Aplică"
            icon="pi pi-check"
            @click="applyFilters"
            class="p-button-primary"
          />
        </div>
      </template>
    </Dialog>

    <div class="flex justify-content-between">
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
              <i class="pi pi-map"></i>
              <h4>{{item.city}}</h4>
            </div>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-map-marker"></i>
              <span>{{ item.formattedDistance }}</span>
            </div>

            <p>{{ truncateDescription(item.description ?? "") }}</p>
            <div class="stars-container" v-if="item.medieReview">
              <i
                v-for="index in 5"
                :key="index"
                class="pi"
                :class="index <= (item.medieReview ?? 0) ? 'pi-star-fill' : 'pi-star'"
                style="color: gold"
              ></i>
              <span>({{ item.medieReview?.toFixed(1) ?? 0 }}/5)</span>
            </div>
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

const showFilterDialog = ref(false);
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
const resetFilters = () => {
  objectiveStore.filter.typeId = null;
  objectiveStore.filter.minRating = null;
  objectiveStore.filter.maxDistance = null;
  objectiveStore.filter.name = null;
  objectiveStore.getLocalObjectives();
};

const applyFilters = () => {
  objectiveStore.getLocalObjectives();
  showFilterDialog.value = false;
};
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
  transition: transform 0.1s ease-in-out;
  cursor: pointer;
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
.filter-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.filter-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-color);
}

:deep(.p-dialog-header) {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
}

:deep(.p-dialog-content) {
  background: var(--surface-card);
}

:deep(.p-dialog-footer) {
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);
}

.stars-container {
  display: inline-flex;
  align-items: center;
  align-self:center;
  gap: 4px;
  margin-top: 8px;
}

.stars-container i {
  font-size: 1.2rem;
}

.stars-container span {
  margin-left: 8px;
  font-size: 0.9rem;
}
</style>
