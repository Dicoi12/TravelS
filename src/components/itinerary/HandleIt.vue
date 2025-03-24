<template>
    <div @click="dialogVisible = true">
      <slot name="button"> </slot>
    </div>
    <Dialog
      v-model:visible="dialogVisible"
      maximizable
      modal
      :header="itineraryStore.selectedItineraryDTO.id ? 'Editează itinerariu' : 'Adaugă itinerariu'"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      @hide="closeDialog()"
    >
      <div class="flex flex-column gap-3">
        <div class="flex justify-content-center flex-column">
          <label for="name">Nume</label>
          <InputText v-model="itineraryStore.selectedItineraryDTO.name" />
        </div>

        <div class="flex justify-content-center flex-column">
          <label for="description">Descriere</label>
          <InputText v-model="itineraryStore.selectedItineraryDTO.description" />
        </div>

        <div class="flex justify-content-center flex-column">
          <label>Obiective</label>
          <MultiSelect
            v-model="itineraryStore.selectedItineraryDTO.objectivesIds"
            :options="objectiveStore.objectives"
            optionLabel="name"
            optionValue="id"
            placeholder="Selectează obiective"
            display="chip"
          />
        </div>

        <div class="flex justify-content-center flex-column">
          <label>Evenimente</label>
          <MultiSelect
            v-model="itineraryStore.selectedItineraryDTO.eventsIds"
            :options="eventStore.events"
            optionLabel="name"
            optionValue="id"
            placeholder="Selectează evenimente"
            display="chip"
          />
        </div>
      </div>

      <div class="flex justify-content-end mt-4">
        <Button
          icon="pi pi-check"
          :label="itineraryStore.selectedItineraryDTO.id ? 'Actualizează' : 'Adaugă'"
          @click="saveItinerary()"
        />
      </div>
    </Dialog>
  </template>
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useItineraryStore } from "../../stores/itineraryStore";
  import { useObjectivesStore } from "../../stores/objectivesStore";
  import { useEventsStore } from "../../stores/eventStore";
  import { defineEmits, watch } from "vue";
  
  const emits = defineEmits(["onClose"]);
  const props = defineProps({
    showDialog: { type: Boolean, default: false },
  });
  const dialogVisible = ref(false);
  const itineraryStore = useItineraryStore();
  const objectiveStore = useObjectivesStore();
  const eventStore = useEventsStore();
  
  async function saveItinerary() {
    if (itineraryStore.selectedItineraryDTO.id) {
      // await itineraryStore.updateItinerary(itineraryStore.selectedItineraryDTO);
    } else {
      // await itineraryStore.addItinerary(itineraryStore.selectedItineraryDTO);
    }
    dialogVisible.value = false;
    // await itineraryStore.getItineraries();
  }
  
  function closeDialog() {
    emits("onClose");
  }
  
  watch(
    () => props.showDialog,
    (newVal: boolean) => {
      dialogVisible.value = newVal;
    }
  );
  
  onMounted(async () => {
    await objectiveStore.getObjectives();
    // await eventStore.getAllEvents();
  });
  </script>
  