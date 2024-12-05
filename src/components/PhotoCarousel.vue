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
        <img :src="slotProps.data" :alt="'Photo ' + slotProps.index" style="max-height: 500px; max-width: 500px;"  />
      </div>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import Carousel from 'primevue/carousel'

defineProps<{
  photos: string[]
}>()
</script>

<style scoped>
.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
</style>