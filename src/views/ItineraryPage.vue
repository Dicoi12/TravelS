<template>
  <div class="itineraries-grid">
    <!-- Grid de itinerarii -->
    <div v-for="itinerary in itineraryStore.itineraries" 
         :key="itinerary.id" 
         class="itinerary-preview-card"
         @click="navigateToDetail(itinerary.id?.toString() || '')">
      <!-- Carusel pentru previzualizare imagini -->
      <swiper
        :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
        :slides-per-view="1"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        class="preview-carousel"
      >
        <swiper-slide v-for="detail in itinerary.itineraryDetails" :key="detail.id">
          <div class="preview-image-container">
            <img 
              :src="getPreviewImage(detail)"
              :alt="detail.name"
              class="preview-image"
            >
            <div class="image-overlay">
              <span class="location-name">{{ detail.name }}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <div class="preview-content">
        <h3>{{ itinerary.name }}</h3>
        <p>{{ itinerary.description }}</p>
        <span class="locations-count">
          {{ itinerary.itineraryDetails.length }} locații de vizitat
        </span>
      </div>
    </div>

    <!-- Modal cu detalii complete -->
    <div v-if="selectedItinerary" class="modal-overlay" @click="selectedItinerary = null">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="selectedItinerary = null">&times;</button>
        
        <h2>{{ selectedItinerary.name }}</h2>
        <p class="itinerary-description">{{ selectedItinerary.description }}</p>

        <div class="details-timeline">
          <div v-for="detail in sortedDetails(selectedItinerary.itineraryDetails)" 
               :key="detail.id" 
               class="timeline-item">
            <div class="timeline-marker">
              <span class="order-number">{{ detail.visitOrder }}</span>
            </div>
            
            <div class="timeline-content">
              <h3>{{ detail.name }}</h3>
              
              <!-- Carusel pentru toate imaginile locației -->
              <swiper
                :modules="[SwiperNavigation, SwiperPagination]"
                :slides-per-view="1"
                :navigation="true"
                :pagination="{ clickable: true }"
                class="detail-carousel"
              >
                <swiper-slide v-for="(image, index) in getDetailImages(detail)" :key="index">
                  <img :src="image" :alt="detail.name" class="detail-image">
                </swiper-slide>
              </swiper>

              <div class="location-details">
                <p v-if="detail.descriere" class="detail-description">
                  {{ detail.descriere }}
                </p>

                <template v-if="detail.objective">
                  <div class="detail-info">
                    <div class="info-item" v-if="detail.objective.city">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ detail.objective.city }}
                    </div>
                    <div class="info-item" v-if="detail.objective.interval">
                      <i class="fas fa-clock"></i>
                      {{ detail.objective.interval }}
                    </div>
                    <div class="info-item" v-if="detail.objective.pret">
                      <i class="fas fa-ticket-alt"></i>
                      {{ detail.objective.pret }}
                    </div>
                    <div class="info-item" v-if="detail.objective.medieReview">
                      <i class="fas fa-star"></i>
                      {{ detail.objective.medieReview.toFixed(1) }}
                    </div>
                  </div>
                </template>

                <template v-if="detail.event">
                  <div class="detail-info">
                    <div class="info-item">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ detail.event.city }}, {{ detail.event.country }}
                    </div>
                    <div class="info-item">
                      <i class="fas fa-calendar-alt"></i>
                      {{ formatDate(detail.event.startDate) }} - {{ formatDate(detail.event.endDate) }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation as SwiperNavigation, Pagination as SwiperPagination, Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useItineraryStore } from '../stores/itineraryStore'
import { onBeforeMount } from 'vue'

const router = useRouter()
const itineraryStore = useItineraryStore()
const selectedItinerary = ref<any>(null)

onBeforeMount(async () => {
  await itineraryStore.getItineraries()
})

const navigateToDetail = (id: string) => {
  router.push(`/itineraries/${id}`)
}

const getPreviewImage = (detail: any) => {
  if (detail.objective && detail.objective.images.length > 0) {
    return detail.objective.images[0]
  }
  if (detail.event && detail.event.images.length > 0) {
    return detail.event.images[0]
  }
  return '/placeholder-image.jpg' // Imagine placeholder pentru cazul în care nu există imagini
}

const getDetailImages = (detail: any) => {
  if (detail.objective) {
    return detail.objective.images
  }
  if (detail.event) {
    return detail.event.images
  }
  return []
}

const sortedDetails = (details: any[]) => {
  return [...details].sort((a, b) => a.visitOrder - b.visitOrder)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.itineraries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.itinerary-preview-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.itinerary-preview-card:hover {
  transform: translateY(-5px);
}

.preview-carousel {
  height: 200px;
}

.preview-image-container {
  position: relative;
  height: 200px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1rem;
  color: white;
}

.preview-content {
  padding: 1.5rem;
}

.locations-count {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.timeline-item {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-marker {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: #42b983;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1rem;
}

.timeline-content {
  flex-grow: 1;
}

.detail-carousel {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Swiper Customization */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #42b983;
}

@media (max-width: 768px) {
  .itineraries-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .detail-image {
    height: 250px;
  }
}
</style>
