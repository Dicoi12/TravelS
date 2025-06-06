<template>
    <div>
      <div class="flex justify-content-between">
        <h1 class="text-white align-self-start ml-2">
          Evenimente importante din zona ta:
        </h1>
        <div class="flex align-items-center gap-2" v-if="!locationAccessGranted">
          <i class="pi pi-map-marker text-white"></i>
          <h2 class="block md:hidden text-white mr-3">
            Vezi evenimentele din jurul tău
          </h2>
        </div>
      </div>
      <div class="grid-container fadein animation-duration-1000">
        <div
          v-for="(item, index) in eventStore.events"
          :key="index"
          class="card-container"
          @click="$router.push(`/events/${item.id}`)"
        >
          <div class="card-content text-white">
            <img
              :src="item.images[0]"
              alt="event image"
              class="image"
            />
            <div class="card-details">
              <h3 class="location">{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <p><strong>Locație:</strong> {{ item.city }}, {{ item.country }}</p>
              <p>
                <strong>Dată:</strong>
                {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
              </p>
            </div>
            <Button 
              class="favorite-button"
            >
              <i class="pi pi-calendar-plus"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeMount } from "vue";
  import { useEventsStore } from "../stores/eventStore";
  
  const eventStore = useEventsStore();
  
  const latitude = ref<number | null>(null);
  const longitude = ref<number | null>(null);
  const locationAccessGranted = ref<boolean>(true);
  
  const formatDate = (date: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("ro-RO", options);
  };
  
  const getUserLocation = async () => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;
          eventStore.getEvents();
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
  
  .favorite-button .pi-calendar-plus {
    color: white;
  }
  
  .favorite-button:hover .pi-calendar-plus {
    color: lightgreen;
  }
  </style>
  