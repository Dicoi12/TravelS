<template>
  <div @click="dialogVisible = true">
    <slot name="button"> </slot>
  </div>
  <Dialog
    v-model:visible="dialogVisible"
    maximizable
    modal
    header="Header"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="closeDialog()"
  >
  <div class="flex justify-content-center flex-column">
    <label for="name">Nume</label>
    <InputText
    v-model="objectivesStore.selectedObjective.name"
    label="Nume"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="name">Tip</label>
      <Dropdown
        v-model="objectivesStore.selectedObjective.type"
        label="Tip"
        :options="useObjectiveTypeStore().objectiveTypes"
        option-value="id"
        option-label="name"
        />
      </div>
      <div class="flex justify-content-center flex-column">
      <label for="city">Oraș</label>
      <InputText
      v-model="objectivesStore.selectedObjective.city"
        label="Oraș"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Descriere</label>
      <InputText
      v-model="objectivesStore.selectedObjective.description"
      label="Descriere"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Durata</label>
      <InputNumber
      v-model="objectivesStore.selectedObjective.duration"
      label="Durata"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Latitudine</label>
      <InputNumber
      v-model="objectivesStore.selectedObjective.latitude"
      label="Latitudine"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Longitudine</label>
      <InputNumber
      v-model="objectivesStore.selectedObjective.longitude"
        label="Longitudine"
        />
      </div>
      <Map
        :latitude="objectivesStore.selectedObjective.latitude ?? 0"
        :longitude="objectivesStore.selectedObjective.longitude ?? 0"
        :isSelectable="true"
        class="mt-2"
        @coordinatesSelected="onMapSelect"
      />
    <div class="flex justify-content-end mt-2">
      <Button
        icon="pi pi-plus"
        :label="
          objectivesStore.selectedObjective.id == 0 ? 'Adaugă' : 'Editează'
        "
        @click="
          objectivesStore.selectedObjective.id == 0
            ? addObjective()
            : updateObjective()
        "
      />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useObjectivesStore } from "../../stores/objectivesStore";
import { defineEmits, watch } from "vue";
import Map from "../map/Map.vue";
import { useObjectiveTypeStore } from "../../stores/objectiveTypeStore";
import { onBeforeMount } from "vue";

onBeforeMount(async()=>{
  await useObjectiveTypeStore().getObjectiveTypes();
})
const emits = defineEmits(["onClose"]);
const props = defineProps({
  showDialog: { type: Boolean, default: false },
});
const dialogVisible = ref(false);
const objectivesStore = useObjectivesStore();
const addObjective = async () => {
  objectivesStore.addObjective();
  dialogVisible.value = false;
  await objectivesStore.getObjectives();
};
const updateObjective = async () => {
  await objectivesStore.updateObjective();
  dialogVisible.value = false;
  await objectivesStore.getObjectives();
};
function closeDialog() {
  emits("onClose");
}

function onMapSelect({ latitude, longitude }: { latitude: number, longitude: number }) {
  objectivesStore.selectedObjective.latitude = latitude;
  objectivesStore.selectedObjective.longitude = longitude;
}

watch(
  () => props.showDialog,
  (newVal: boolean) => {
    dialogVisible.value = newVal;
  }
);
</script>
