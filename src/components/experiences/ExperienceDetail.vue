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
            <i class="pi pi-map-marker"></i>
            <span>{{ experience?.locationName || `${experience?.city}, ${experience?.country}` }}</span>
          </div>
          <div class="meta-item" v-if="experience?.rating">
            <i class="pi pi-star"></i>
            <span>{{ experience.rating }}/5</span>
          </div>
          <div class="meta-item">
            <i class="pi pi-globe"></i>
            <span>{{ experience?.country }}</span>
          </div>
          <div class="meta-item">
            <i class="pi pi-building"></i>
            <span>{{ experience?.city }}</span>
          </div>
        </div>
  
        <div class="description">
          <h2>Descriere</h2>
          <p>{{ experience?.description }}</p>
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
            :src="`https://www.google.com/maps?q=${experience?.latitude},${experience?.longitude}&output=embed`"
          ></iframe>
        </div>

        <div class="additional-info">
          <h2>Informații adiționale</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Latitudine:</span>
              <span class="value">{{ experience?.latitude }}</span>
            </div>
            <div class="info-item">
              <span class="label">Longitudine:</span>
              <span class="value">{{ experience?.longitude }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value">{{ experience?.isPublic ? 'Public' : 'Privat' }}</span>
            </div>
          </div>
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
    flex-wrap: wrap;
    gap: 2rem;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-item i {
    color: var(--primary-color);
  }
  
  .description {
    margin: 2rem 0;
    line-height: 1.6;
  }
  
  .map-container {
    margin-top: 2rem;
  }
  
  .additional-info {
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .label {
    font-weight: bold;
    color: var(--primary-color);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
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
  
    .experience-meta {
      flex-direction: column;
      gap: 1rem;
    }
  }
  </style>
  