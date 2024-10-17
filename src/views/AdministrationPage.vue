<template>
  <div class="flex gap-3 w-full h-full">
    <div class="bg-white h-max mt-7 border-round-xl">
      <PanelMenu
        v-model:expandedKeys="expandedKeys"
        :model="items"
        multiple
        style="width: 15rem"
      />
    </div>
    <div class="w-full h-full bg-white mt-7 m-4 border-round-xl">
      <!-- <div v-if="currentSetting == 'Obiective'"> -->
        <DataTable :value="objectiveStore.objectives">
          <Column field="id" header="Id"></Column>
          <Column field="name" header="Nume"></Column>
          <Column field="description" header="Descriere"></Column>
        </DataTable>
      <!-- </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref ,onBeforeMount} from "vue";
import PanelMenu from "primevue/panelmenu";
import { useObjectivesStore } from "../stores/objectivesStore";
const expandedKeys = ref();
const currentSetting = ref("");
const objectiveStore = useObjectivesStore();
const items = ref([
  {
    label: "Obiective",
    icon: "pi pi-map-marker",
    items: [
      {
        label: "Adaugă",
        icon: "pi pi-plus",
        shortcut: "⌘+N",
        command: () => {
          currentSetting.value = "Obiective";
        },
      },
      {
        label: "Editează",
        icon: "pi pi-pencil",
      },
      {
        label: "Șterge",
        icon: "pi pi-trash",
        shortcut: "⌘+S",
      },
    ],
  },
  {
    label: "Evenimente",
    icon: "pi pi-map",
    items: [
      {
        label: "Adaugă",
        icon: "pi pi-plus",
        shortcut: "⌘+N",
      },
      {
        label: "Editează",
        icon: "pi pi-pencil",
      },
      {
        label: "Șterge",
        icon: "pi pi-trash",
        shortcut: "⌘+S",
      },
    ],
  },
  {
    label: "Itinerarii",
    icon: "pi pi-directions-alt",
    items: [
      {
        label: "Adaugă",
        icon: "pi pi-plus",
        shortcut: "⌘+N",
      },
      {
        label: "Editează",
        icon: "pi pi-pencil",
      },
      {
        label: "Șterge",
        icon: "pi pi-trash",
        shortcut: "⌘+S",
      },
    ],
  },
]);
onBeforeMount(async ()=>{
await objectiveStore.getObjectives();
})
</script>
