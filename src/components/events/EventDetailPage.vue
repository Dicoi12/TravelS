<template>
  <div class="event-detail-container">
    <!-- Secțiunea de imagini -->
    <div class="images-section">
      <img 
        :src="event?.images?.[0] || 'https://via.placeholder.com/800x500?text=No+Image'" 
        alt="Imagine principală eveniment"
        class="main-image"
      />
      <div class="thumbnail-container">
        <img 
          v-for="(image, index) in event?.images?.slice(1)" 
          :key="index"
          :src="image"
          alt="Imagine eveniment"
          class="thumbnail"
        />
      </div>
    </div>

    <!-- Secțiunea de detalii -->
    <div class="details-section">
      <h1>{{ event?.name }}</h1>
      
      <div class="event-meta">
        <div class="meta-item">
          <i class="pi pi-calendar"></i>
          <span>{{ formatDate(event?.startDate) }} - {{ formatDate(event?.endDate) }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-map-marker"></i>
          <span>{{ event?.city }}, {{ event?.country }}</span>
        </div>
      </div>

      <div class="description">
        <h2>Descriere</h2>
        <p>{{ event?.description }}</p>
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
          :src="`https://www.google.com/maps?q=${event?.latitude},${event?.longitude}&output=embed`"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventsStore } from '../../stores/eventStore';

const route = useRoute();
const eventStore = useEventsStore();
const event = ref();

const formatDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("ro-RO", options);
};

onMounted(async () => {
  const eventId = route.params.id;
  await eventStore.fetchEventById(parseInt(eventId as string));
  event.value = eventStore.selectedEvent;
});
</script>

<style scoped>
.event-detail-container {
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

.event-meta {
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
  .event-detail-container {
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
