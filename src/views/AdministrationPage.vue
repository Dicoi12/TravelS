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
import { computed, ref, watch } from "vue";
import { onBeforeMount } from "vue";
import ObiectiveTypeAdministration from "../components/objectives/ObiectiveTypeAdministration.vue";

const STORAGE_KEY = 'admin-current-setting';
const currentSetting = ref("");

// Funcție pentru salvarea setării curente în localStorage
const saveCurrentSetting = (setting: string) => {
  localStorage.setItem(STORAGE_KEY, setting);
};

// Funcție pentru încărcarea setării din localStorage
const loadCurrentSetting = (): string => {
  return localStorage.getItem(STORAGE_KEY) || "Obiective";
};

onBeforeMount(() => {
  currentSetting.value = loadCurrentSetting();
});

// Monitorizăm schimbările în currentSetting și le salvăm
watch(currentSetting, (newValue) => {
  saveCurrentSetting(newValue);
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

items.value = items.value.map(item => ({
  ...item,
  class: computed(() => currentSetting.value === item.label ? 'active-menu-item' : '')
}));
</script>

<style scoped>
:deep(.active-menu-item) {
  background-color: var(--primary-color) !important;
  color: rgb(107, 107, 107) !important;
}

:deep(.active-menu-item .p-menuitem-icon) {
  color: rgb(112, 111, 111) !important;
}

:deep(.active-menu-item .p-menuitem-text) {
  color: rgb(112, 111, 111) !important;
}
</style>
