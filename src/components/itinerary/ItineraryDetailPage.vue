<template>
  <div class="objective-detail-container">
   

    <!-- Secțiunea de detalii -->
    <div class="details-section">
      <h1>{{ itinerary?.name }}</h1>

      <div class="objective-meta">
        <div class="meta-item">
          <i class="pi pi-map-marker"></i>
          <span>{{ itinerary?.itineraryDetails?.length }} locații</span>
        </div>
      </div>

      <div class="description">
        <h2>Descriere</h2>
        <p>{{ itinerary?.description }}</p>
      </div>

      <!-- Locații -->
      <div class="locations-section">
        <h2>Locații</h2>
        <div v-for="detail in sortedDetails(itinerary?.itineraryDetails)" 
             :key="detail.id" 
             class="location-item">
          <div class="location-header">
            <span class="order-number">{{ detail.visitOrder }}</span>
            <h3>{{ detail.name }}</h3>
          </div>

          <div class="location-content">
            <!-- Carusel pentru imagini -->
            <div class="location-images" v-if="getDetailImages(detail).length > 0">
              <PhotoCarousel
                :photos="getDetailImages(detail)"
              />
            </div>

            <div class="location-details">
              <p v-if="detail.descriere" class="detail-description">
                {{ detail.descriere }}
              </p>

              <!-- Informații pentru obiective -->
              <template v-if="detail.objective">
                <div class="info-grid">
                  <div class="info-item" v-if="detail.objective.name">
                    <i class="pi pi-info-circle"></i>
                    {{ detail.objective.name }}
                  </div>
                  <div class="info-item" v-if="detail.objective.description">
                    <i class="pi pi-align-left"></i>
                    {{ detail.objective.description }}
                  </div>
                  <div class="info-item" v-if="detail.objective.city">
                    <i class="pi pi-map-marker"></i>
                    {{ detail.objective.city }}
                  </div>
                  <div class="info-item" v-if="detail.objective.interval">
                    <i class="pi pi-clock"></i>
                    {{ detail.objective.interval }}
                  </div>
                  <div class="info-item" v-if="detail.objective.pret">
                    <i class="pi pi-ticket"></i>
                    {{ detail.objective.pret }}
                  </div>
                  <div class="info-item" v-if="detail.objective.medieReview">
                    <i class="pi pi-star"></i>
                    {{ detail.objective.medieReview.toFixed(1) }}
                  </div>
                  <div class="info-item" v-if="detail.objective.website">
                    <i class="pi pi-globe"></i>
                    <a :href="detail.objective.website" target="_blank">{{ detail.objective.website }}</a>
                  </div>
                </div>
                <!-- Harta pentru obiectiv -->
                <div class="mini-map-container" v-if="detail.objective.latitude && detail.objective.longitude">
                  <iframe
                    width="100%"
                    height="200"
                    style="border: 0"
                    loading="lazy"
                    allowfullscreen
                    :src="`https://www.google.com/maps?q=${detail.objective.latitude},${detail.objective.longitude}&output=embed&zoom=12`"
                  ></iframe>
                </div>
              </template>

              <!-- Informații pentru evenimente -->
              <template v-if="detail.event">
                <div class="info-grid">
                  <div class="info-item" v-if="detail.event.name">
                    <i class="pi pi-info-circle"></i>
                    {{ detail.event.name }}
                  </div>
                  <div class="info-item" v-if="detail.event.description">
                    <i class="pi pi-align-left"></i>
                    {{ detail.event.description }}
                  </div>
                  <div class="info-item" v-if="detail.event.city">
                    <i class="pi pi-map-marker"></i>
                    {{ detail.event.city }}
                  </div>
                  <div class="info-item" v-if="detail.event.country">
                    <i class="pi pi-globe"></i>
                    {{ detail.event.country }}
                  </div>
                  <div class="info-item" v-if="detail.event.startDate && detail.event.startDate !== '0001-01-01T00:00:00'">
                    <i class="pi pi-calendar"></i>
                    {{ formatDate(detail.event.startDate) }} - {{ formatDate(detail.event.endDate) }}
                  </div>
                </div>
                <!-- Harta pentru eveniment -->
                <div class="mini-map-container" v-if="detail.event.latitude && detail.event.longitude">
                  <iframe
                    width="100%"
                    height="200"
                    style="border: 0"
                    loading="lazy"
                    allowfullscreen
                    :src="`https://www.google.com/maps?q=${detail.event.latitude},${detail.event.longitude}&output=embed&zoom=12`"
                  ></iframe>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useItineraryStore } from '../../stores/itineraryStore'
import PhotoCarousel from '../PhotoCarousel.vue'

const route = useRoute()
const itineraryStore = useItineraryStore()
const itinerary = ref<any>(null)

onMounted(async () => {
  const itineraryId = route.params.id
  await itineraryStore.getItineraryById(itineraryId as string)
  itinerary.value = itineraryStore.selectedItinerary
})

const getDetailImages = (detail: any) => {
  if (detail?.objective?.images?.length > 0) {
    return detail.objective.images
  }
  if (detail?.event?.images?.length > 0) {
    return detail.event.images
  }
  return []
}

const sortedDetails = (details: any[] | undefined) => {
  if (!details) return [];
  return [...details].sort((a, b) => a.visitOrder - b.visitOrder);
}

const formatDate = (date: string) => {
  if (!date || date === '0001-01-01T00:00:00') return ''
  return new Date(date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.objective-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: white;
}

.images-section {
  margin-bottom: 2rem;
}

.details-section {
  background: #666666;
  padding: 2rem;
  border-radius: 8px;
}

.objective-meta {
  display: flex;
  flex-wrap: wrap;
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
  line-height: 1.6;
}

.locations-section {
  margin-top: 2rem;
}

.location-item {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.location-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-number {
  background: #4caf50;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.location-content {
  margin-top: 1rem;
}

.location-images {
  margin-bottom: 1.5rem;
}

.location-details {
  margin-top: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item a {
  color: #4caf50;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.2rem;
  margin: 0;
}

.detail-description {
  line-height: 1.6;
  margin: 1rem 0;
}

.mini-map-container {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mini-map-container iframe {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .objective-detail-container {
    margin: 1rem;
  }

  .details-section {
    padding: 1rem;
  }

  .objective-meta {
    gap: 1rem;
  }

  .location-item {
    padding: 1rem;
  }
}
</style> 