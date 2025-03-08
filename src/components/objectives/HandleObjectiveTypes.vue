<template>
  <div @click="dialogVisible = true">
    <slot name="button"> </slot>
  </div>
  <Dialog
    v-model:visible="dialogVisible"
    maximizable
    modal
    header="Tip obiectiv"
    :style="{ width: '40rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="closeDialog()"
  >
    <div class="flex justify-content-center flex-column">
      <label for="name">Nume</label>
      <InputText
        v-model="objectiveTypeStore.selectedObjectiveType.name"
        label="Nume"
      />
    </div>
    <div class="flex justify-content-center flex-column mt-2">
      <label for="description">Descriere</label>
      <InputText
        v-model="objectiveTypeStore.selectedObjectiveType.description"
        label="Descriere"
      />
    </div>
    <div class="flex justify-content-end mt-3">
      <Button
        icon="pi pi-plus"
        :label="
          objectiveTypeStore.selectedObjectiveType.id == 0
            ? 'Adaugă'
            : 'Editează'
        "
        @click="
          objectiveTypeStore.selectedObjectiveType.id == 0
            ? addObjectiveType()
            : updateObjectiveType()
        "
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useObjectiveTypeStore } from "../../stores/objectiveTypeStore";
import { defineEmits, defineProps } from "vue";

const emits = defineEmits(["onClose"]);
const props = defineProps({
  showDialog: { type: Boolean, default: false },
});

const dialogVisible = ref(false);
const objectiveTypeStore = useObjectiveTypeStore();

const addObjectiveType = async () => {
  await objectiveTypeStore.addObjectiveType();
  dialogVisible.value = false;
  await objectiveTypeStore.getObjectiveTypes();
};

const updateObjectiveType = async () => {
  await objectiveTypeStore.updateObjectiveType(objectiveTypeStore.selectedObjectiveType.id);
  dialogVisible.value = false;
  await objectiveTypeStore.getObjectiveTypes();
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
