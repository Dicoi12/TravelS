<template>
  <div>
    <div class="flex gap-3 w-full h-full">
      <div class="bg-white h-max mt-7 border-round-xl">
        <Menu :model="items" multiple style="width: 15rem" />
      </div>
      <div class="h-max bg-white mt-7 m-4 border-round-xl w-full">
        <!-- <div v-if="currentSetting == 'Obiective'"> -->
        <ObjectiveAdministration v-if="currentSetting == 'Obiective'" />
        <ObiectiveTypeAdministration v-if="currentSetting == 'ObiectiveType'" />
        <EventsAdministration v-if="currentSetting == 'Evenimente'" />
        <ExperiencesAdministration v-if="currentSetting == 'Experiente'" />
        <ItineraryAdministration v-if="currentSetting == 'Itinerarii'" />
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onBeforeMount } from "vue";
import ObiectiveTypeAdministration from "../components/objectives/ObiectiveTypeAdministration.vue";
const currentSetting = ref("");
onBeforeMount(() => {
  currentSetting.value = "Obiective";
});
const items = ref([
  {
    label: "Obiective",
    icon: "pi pi-map-marker",
    command: () => {
      currentSetting.value = "Obiective";
    },
  }, 
  {
    label: "Tipuri Obiective",
    icon: "pi pi-cog",
    command: () => {
      currentSetting.value = "ObiectiveType";
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
  {
    label: "Experiente",
    icon: "pi pi-directions-alt",
    command: () => {
      currentSetting.value = "Experiente";
    },
  },
]);
</script>
