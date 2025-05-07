<template>
  <Carousel 
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
  photos: { type: Array, default: [] }
})
</script>

<style scoped>
.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>