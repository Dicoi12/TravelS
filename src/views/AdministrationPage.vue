<template>
  <div>
    <div class="flex gap-3 w-full h-full">
      <div class="bg-white h-max mt-7 border-round-xl">
        <Menu
          :model="items"
          multiple
          style="width: 15rem"
        />
      </div>
      <div class="w-full h-max bg-white mt-7 m-4 border-round-xl">
        <!-- <div v-if="currentSetting == 'Obiective'"> -->
        <ObjectiveAdministration v-if="currentSetting == 'Obiective'" />
        <EventsAdministration v-if="currentSetting == 'Evenimente'" />
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
onBeforeMount(() => {
  currentSetting.value = "Obiective";
});
const currentSetting = ref("");
const items = ref([
  {
    label: "Obiective",
    icon: "pi pi-map-marker",
    command: () => {
      currentSetting.value = "Obiective";
    },
  },
  {
    label: "Evenimente",
    icon: "pi pi-map",
    command: () => {
      currentSetting.value = "Evenimente";
    },
  },
  {
    label: "Itinerarii",
    icon: "pi pi-directions-alt",
    command: () => {
      currentSetting.value = "Itinerarii";
    },
  },
]);


</script>
