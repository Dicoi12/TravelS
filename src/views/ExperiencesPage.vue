<template>
    <div>
      <div class="flex justify-content-between">
        <h1 class="text-white align-self-start ml-2">
          Experiențe memorabile din zona ta:
        </h1>
        <div class="flex align-items-center gap-2" v-if="!locationAccessGranted">
          <i class="pi pi-map-marker text-white"></i>
          <h2 class="block md:hidden text-white mr-3">
            Descoperă experiențele din jurul tău
          </h2>
        </div>
      </div>
      <div class="grid-container fadein animation-duration-1000">
        <div
          v-for="(item, index) in experienceStore.experiences.filter(e => e.isPublic)"
          :key="index"
          class="card-container"
          @click="$router.push(`/experiences/${item.id}`)"
        >
          <div class="card-content text-white">
            <img
              :src="item.images?.[0] "
              alt="experience image"
              class="image"
            />
            <div class="card-details">
              <h3 class="location">{{ item.title }}</h3>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-map-marker"></i>
                <span>{{ item.locationName || `${item.city}, ${item.country}` }}</span>
              </div>
              <div v-if="item.rating" class="stars-container">
                <i
                  v-for="index in 5"
                  :key="index"
                  class="pi"
                  :class="index <= item.rating ? 'pi-star-fill' : 'pi-star'"
                  style="color: gold"
                ></i>
                <span>({{ item.rating }}/5)</span>
              </div>
            </div>
            <Button class="favorite-button" @click.stop>
              <i class="pi pi-calendar-plus"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeMount } from "vue";
  import { useExperienceStore } from "../stores/experienceStore";
  
  const experienceStore = useExperienceStore();
  
  const latitude = ref<number | null>(null);
  const longitude = ref<number | null>(null);
  const locationAccessGranted = ref<boolean>(true);
  
  
  const getUserLocation = async () => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(
        async(position) => {
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;
          await experienceStore.getAllExperiences();
          locationAccessGranted.value = true;
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
  
  onBeforeMount(async () => {
    await getUserLocation();
  });
  </script>
  
  <style scoped>
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.75rem;
    justify-content: flex-start;
    max-height: 80vh;
    overflow-y: auto;
    padding: 0.5rem 0.5rem 1rem 0.5rem;
    scrollbar-width: thin;
  }

  .grid-container::-webkit-scrollbar {
    width: 6px;
  }

  .grid-container::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  .card-container {
    position: relative;
    width: 300px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    background-color: #1e2d25;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .card-container:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
  }

  .card-content {
    position: relative;
  }

  .image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .card-container:hover .image {
    transform: scale(1.08);
  }

  .card-details {
    padding: 0.85rem;
    background-color: #1e2d25;
    color: white;
  }

  .location {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.35rem;
  }

  .favorite-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.45);
    border: none;
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    transition: background 0.2s, color 0.2s;
  }

  .favorite-button:hover {
    background: rgba(80, 180, 100, 0.85);
  }
  
  .stars-container {
    display: inline-flex;
    align-items: center;
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
  