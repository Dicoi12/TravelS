<template>
  <Button icon="pi pi-plus" label="Adaugă" @click="dialogVisible = true" />
  <Dialog
    v-model:visible="props.showDialog"
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
    <Button icon="pi pi-plus" :label="objectivesStore.selectedObjective.id==0?'Adaugă':'Editează'" @click="addObjective()" />
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useObjectivesStore } from "../../stores/objectivesStore";
import { defineEmits } from "vue";

const emits=defineEmits(['onClose']);
const props = defineProps({
  showDialog: { type: Boolean, default: false },
});
const dialogVisible = ref(false);
const objectivesStore = useObjectivesStore();
const addObjective = async () => {
  await objectivesStore.addObjective();
  dialogVisible.value = false;
};
function closeDialog(){
  emits('onClose');
}
</script>
