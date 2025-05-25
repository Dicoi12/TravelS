<template>
  <div @click="dialogVisible = true">
    <slot name="button"> </slot>
  </div>
  <Dialog
    v-model:visible="dialogVisible"
    maximizable
    modal
    :header="
      experienceStore.selectedExperience.id == 0
        ? 'Adaugă experiență'
        : 'Editează experiență'
    "
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="closeDialog()"
  >
    <div class="flex justify-content-center flex-column">   
      <label for="name">Nume</label>
      <InputText v-model="experienceStore.selectedExperience.title" label="Nume" />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="city">Oraș</label>
      <InputText v-model="experienceStore.selectedExperience.city" label="Oraș" />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Descriere</label>
      <InputText
        v-model="experienceStore.selectedExperience.description"
        label="Descriere"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Latitudine</label>
      <InputNumber
        v-model="experienceStore.selectedExperience.latitude"
        label="Latitudine"
      />
    </div>
    <div class="flex justify-content-center flex-column">
      <label for="description">Longitudine</label>
      <InputNumber
        v-model="experienceStore.selectedExperience.longitude"
        label="Longitudine"
      />
    </div>

    <Map
      :latitude="experienceStore.selectedExperience.latitude"
      :longitude="experienceStore.selectedExperience.longitude"
      class="mt-2"
      v-if="
        experienceStore.selectedExperience.latitude && experienceStore.selectedExperience.longitude
      "
    />

    <div class="flex justify-content-end mt-2">
      <Button
        icon="pi pi-plus"
        :label="experienceStore.selectedExperience.id == 0 ? 'Adaugă' : 'Editează'"
        @click="experienceStore.selectedExperience.id == 0 ? addExperience() : updateExperience()"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useExperienceStore } from "../../stores/experienceStore";
import { defineEmits, watch } from "vue";
import Map from "../map/Map.vue";

const emits = defineEmits(["onClose"]);
const props = defineProps({
  showDialog: { type: Boolean, default: false },
});
const dialogVisible = ref(false);
const experienceStore = useExperienceStore();

const addExperience = async () => {
  await experienceStore.addExperience(experienceStore.selectedExperience);
  dialogVisible.value = false;
  await experienceStore.getAllExperiences();
};

const updateExperience = async () => {
  await experienceStore.updateExperience(experienceStore.selectedExperience);
  dialogVisible.value = false;
  await experienceStore.getAllExperiences();
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
