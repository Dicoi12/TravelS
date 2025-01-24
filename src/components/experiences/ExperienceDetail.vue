<template>
    <div class="experience-detail-container">
      <!-- Secțiunea de imagini -->
      <div class="images-section">
        <PhotoCarousel :photos="experienceStore.selectedExperience?.images || []" />
      </div>
  
      <!-- Secțiunea de detalii -->
      <div class="details-section">
        <h1>{{ experience?.title }}</h1>
  
        <div class="experience-meta">
          <div class="meta-item">
            <i class="pi pi-calendar"></i>
            <span>{{ formatDate(experienceStore.selectedExperience?.date) }}</span>
          </div>
          <div class="meta-item">
            <i class="pi pi-map-marker"></i>
            <span>{{ experienceStore.selectedExperience?.location }}</span>
          </div>
        </div>
  
        <div class="description">
          <h2>Descriere</h2>
          <p>{{ experienceStore.selectedExperience?.description }}</p>
        </div>
  
        <!-- Harta Google Maps -->
        <div class="map-container">
          <h2>Locație</h2>
          <iframe
            width="100%"
            height="400"
            style="border:0"
            loading="lazy"
            allowfullscreen
            :src="`https://www.google.com/maps?q=Bucharest&output=embed`"
          ></iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useExperienceStore } from "../../stores/experienceStore";
  
  const route = useRoute();
  const experienceStore = useExperienceStore();
  const experience = ref();
  
  const formatDate = (date: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("ro-RO", options);
  };
  
//   function getCoordinates(location: string) {
//     // Exemplu simplificat: returnăm coordonate fixe pentru locație
//     // Ideal: utilizarea unui serviciu de geocodare pentru coordonate dinamice
//     const predefinedCoordinates = {
//       "București": "44.4268,26.1025",
//       "Cluj-Napoca": "46.7712,23.6236",
//     };
//     return predefinedCoordinates[location] || "0,0";
//   }
  
  onMounted(async () => {
    const experienceId = route.params.id;
    await experienceStore.getExperienceById(parseInt(experienceId as string));
    experience.value = experienceStore.selectedExperience;
  });
  </script>
  
  <style scoped>
  .experience-detail-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    color: white;
  }
  
  .images-section {
    margin-bottom: 2rem;
  }
  
  .main-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .thumbnail-container {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }
  
  .thumbnail {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .thumbnail:hover {
    transform: scale(1.05);
  }
  
  .details-section {
    background: #666666;
    padding: 2rem;
    border-radius: 8px;
  }
  
  .experience-meta {
    display: flex;
    gap: 2rem;
    margin: 1rem 0;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .description {
    margin: 2rem 0;
  }
  
  .map-container {
    margin-top: 2rem;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    .experience-detail-container {
      margin: 1rem;
    }
  
    .main-image {
      height: 300px;
    }
  
    .details-section {
      padding: 1rem;
    }
  }
  </style>
  