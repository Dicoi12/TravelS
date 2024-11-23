<template>
    <Galleria
      :value="props.images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%"
        />
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
      </template>
    </Galleria>
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import { onBeforeMount } from "vue";
  onBeforeMount(() => {
  });
  const props = defineProps({
    images: {
      type: Array,
      required: true,
    },
  });
  const responsiveOptions = ref([
    {
      breakpoint: "1300px",
      numVisible: 4,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ]);
  </script>