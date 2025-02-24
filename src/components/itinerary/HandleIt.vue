<template>
    <div @click="dialogVisible = true">
      <slot name="button"> </slot>
    </div>
    <Dialog
      v-model:visible="dialogVisible"
      maximizable
      modal
      :header="
        eventStore.selectedEvent.id == 0
          ? 'Adaugă Itinerariu'
          : 'Editează itinerariu'
      "
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      @hide="closeDialog()"
    >
      <div class="flex justify-content-center flex-column">
        <label for="name">Nume</label>
        <InputText v-model="eventStore.selectedEvent.name" label="Nume" />
      </div>
      <div class="flex justify-content-center flex-column">
        <label for="description">Descriere</label>
        <InputText
          v-model="eventStore.selectedEvent.description"
          label="Descriere"
        />
      </div>
      <MultiSelect />
      <div class="flex justify-content-end mt-2">
        <Button
          icon="pi pi-plus"
          :label="eventStore.selectedEvent.id == 0 ? 'Adaugă' : 'Editează'"
          @click="eventStore.selectedEvent.id == 0 ? addEvent() : updateEvent()"
        />
      </div>
    </Dialog>
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import { useEventsStore } from "../../stores/eventStore";
  import { defineEmits, watch } from "vue";
  
  const emits = defineEmits(["onClose"]);
  const props = defineProps({
    showDialog: { type: Boolean, default: false },
  });
  const dialogVisible = ref(false);
  const eventStore = useEventsStore();
  const addEvent = async () => {
    await eventStore.addEvent(eventStore.selectedEvent);
    dialogVisible.value = false;
    await eventStore.getEvents();
  };
  const updateEvent = async () => {
    await eventStore.updateEvent(eventStore.selectedEvent);
    dialogVisible.value = false;
    await eventStore.getEvents();
  };
  function closeDialog() {
    emits("onClose");
  }
  
  watch(
    () => props.showDialog,
    (newVal: boolean) => {
      dialogVisible.value = newVal;
    }
  );
  </script>
  