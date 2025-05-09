<template>
  <div v-if="photos.length === 1" class="single-image-container">
    <img :src="photos[0]" :alt="'Photo'" class="single-image" />
  </div>
  <Carousel 
    v-else
    :value="photos" 
    :numVisible="1" 
    :numScroll="1" 
    :circular="true"
    :autoplayInterval="3000"
  >
    <template #item="slotProps">
      <div class="carousel-item">
        <img :src="slotProps.data" :alt="'Photo ' + slotProps.index" class="carousel-image" />
      </div>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Carousel from 'primevue/carousel'

defineProps({
  photos: { type: Array as () => string[], default: () => [] }
})
</script>

<style scoped>
.single-image-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.single-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>