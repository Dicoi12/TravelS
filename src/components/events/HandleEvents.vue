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
        ? 'Adaugă eveniment'
        : 'Editează eveniment'
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
    <label for="city">Oraș</label>
    <InputText v-model="eventStore.selectedEvent.city" label="Oraș" />
  </div>
  <div class="flex justify-content-center flex-column">
      <label for="country">Țară</label>
      <InputText v-model="eventStore.selectedEvent.country" label="Țară" />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Descriere</label>
      <InputText
      v-model="eventStore.selectedEvent.description"
      label="Descriere"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Latitudine</label>
      <InputNumber
      v-model="eventStore.selectedEvent.latitude"
      label="Latitudine"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Longitudine</label>
      <InputNumber
      v-model="eventStore.selectedEvent.longitude"
      label="Longitudine"
      />
    </div>
    <Map
      :latitude="eventStore.selectedEvent.latitude ?? 0"
      :longitude="eventStore.selectedEvent.longitude ?? 0"
      :isSelectable="true"
      class="mt-2"
      @coordinatesSelected="onMapSelect"
    />
    <div class="flex justify-content-center flex-column">
      <label for="description">Data început</label>
      <Calendar v-model="eventStore.selectedEvent.startDate" label="Data" />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Data sfârșit</label>
      <Calendar v-model="eventStore.selectedEvent.endDate" label="Data" />
    </div>
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
import Map from "../map/Map.vue";

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

function onMapSelect({ latitude, longitude }: { latitude: number, longitude: number }) {
  eventStore.selectedEvent.latitude = latitude;
  eventStore.selectedEvent.longitude = longitude;
}

watch(
  () => props.showDialog,
  (newVal: boolean) => {
    dialogVisible.value = newVal;
  }
);
</script>
