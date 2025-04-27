<template>
    <div class="itinerary-detail-page">
      <div v-if="itinerary" class="itinerary-container">
        <!-- Header cu imagine și titlu -->
        <div class="itinerary-header">
          <div class="header-image">
            <img :src="getHeaderImage()" :alt="itinerary.name" class="cover-image">
            <div class="header-overlay">
              <h1>{{ itinerary.name }}</h1>
              <div class="header-meta">
                <span class="locations-count">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ itinerary.itineraryDetails.length }} locații
                </span>
                <span class="duration" v-if="itinerary.duration">
                  <i class="fas fa-clock"></i>
                  {{ itinerary.duration }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Descriere itinerariu -->
        <div class="itinerary-description">
          <p>{{ itinerary.description }}</p>
        </div>
  
        <!-- Timeline cu locații -->
        <div class="timeline-container">
          <div v-for="detail in sortedDetails(itinerary.itineraryDetails)" 
               :key="detail.id" 
               class="timeline-item">
            <div class="timeline-marker">
              <span class="order-number">{{ detail.visitOrder }}</span>
            </div>
            
            <div class="timeline-content">
              <h2>{{ detail.name }}</h2>
              
              <!-- Carusel pentru imagini -->
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
  
                <!-- Informații pentru obiective -->
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
  
                <!-- Informații pentru evenimente -->
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
      <div v-else class="loading">
        Se încarcă...
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation as SwiperNavigation, Pagination as SwiperPagination } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import { useItineraryStore } from '../../stores/itineraryStore'
  
  const route = useRoute()
  const itineraryStore = useItineraryStore()
  const itinerary = ref<any>(null)
  
  onMounted(async () => {
    const itineraryId = route.params.id
    await itineraryStore.getItineraryById(itineraryId as string)
    itinerary.value = itineraryStore.selectedItinerary
  })
  
  const getHeaderImage = () => {
    if (itinerary.value?.itineraryDetails?.[0]) {
      return getPreviewImage(itinerary.value.itineraryDetails[0])
    }
    return '/placeholder-image.jpg'
  }
  
  const getPreviewImage = (detail: any) => {
    if (detail.objective && detail.objective.images.length > 0) {
      return detail.objective.images[0]
    }
    if (detail.event && detail.event.images.length > 0) {
      return detail.event.images[0]
    }
    return '/placeholder-image.jpg'
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
  .itinerary-detail-page {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .itinerary-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .itinerary-header {
    position: relative;
    margin-bottom: 2rem;
  }
  
  .header-image {
    position: relative;
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .header-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: 2rem;
    color: white;
  }
  
  .header-overlay h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .header-meta {
    display: flex;
    gap: 2rem;
  }
  
  .header-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .itinerary-description {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .timeline-container {
    position: relative;
    padding: 2rem 0;
  }
  
  .timeline-item {
    display: flex;
    margin-bottom: 3rem;
    position: relative;
  }
  
  .timeline-marker {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    background: #42b983;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    margin-right: 1.5rem;
  }
  
  .timeline-content {
    flex-grow: 1;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .timeline-content h2 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  .detail-carousel {
    margin: 1.5rem 0;
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
    margin-top: 1.5rem;
  }
  
  .info-item {
    background: #f0f0f0;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  
  .detail-description {
    line-height: 1.6;
    color: #555;
    margin: 1.5rem 0;
  }
  
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
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-size: 1.5rem;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .itinerary-container {
      padding: 0 1rem;
    }
  
    .header-image {
      height: 300px;
    }
  
    .header-overlay h1 {
      font-size: 2rem;
    }
  
    .timeline-marker {
      width: 40px;
      height: 40px;
    }
  
    .detail-image {
      height: 250px;
    }
  }
  </style> 