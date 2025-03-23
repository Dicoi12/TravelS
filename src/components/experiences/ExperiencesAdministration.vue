<template>
    <DataTable
      :value="experienceStore.experiences"
      v-model:editingRows="editingRows"
      editMode="row"
      scrollable
      scrollHeight="45rem"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
    >
      <template #header>
        <div class="flex justify-content-between">
          <div class="flex w-full gap-3">
            <div class="font-bold text-xl">Gestionează experiențele</div>
            <InputText
              placeholder="Caută după nume"
              class="w-8"
              @input="getExperienceSearch()"
            />
          </div>
          <div class="flex justify-content-end">
            <HandleExperiences
              :show-dialog="showEditDialog"
              @on-close="showEditDialog = false"
            >
              <template #button>
                <Button
                  icon="pi pi-plus"
                  label="Adaugă"
                  @click="experienceStore.resetSelectedExperience()"
                />
              </template>
            </HandleExperiences>
          </div>
        </div>
      </template>
  
      <Column field="id" header="Id"></Column>
      <Column field="name" header="Nume">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>
      <Column field="city" header="Oraș">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>
      <Column field="description" header="Descriere">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>
      <Column field="latitude" header="Latitudine">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" fluid />
        </template>
      </Column>
      <Column field="longitude" header="Longitudine">
        <template #editor="{ data, field }">
          <InputNumber v-model="data[field]" fluid />
        </template>
      </Column>
      <Column style="width: 10%; min-width: 8rem" header="Acțiuni">
        <template #body="slotProps">
          <div class="flex gap-3">
            <i class="pi pi-pencil" @click="handleEditExperience(slotProps.data)"></i>
            <i class="pi pi-trash" @click="deleteExperience(slotProps.data.id)"></i>
          </div>
        </template>
      </Column>
    </DataTable>
  
    <Dialog
      v-model:visible="showEditDialog"
      :header="
        experienceStore.selectedExperience.id == 0
          ? 'Adaugă experiență'
          : 'Editează experiență'
      "
      :modal="true"
      :closable="false"
    >
      <HandleExperiences
        :show-dialog="showEditDialog"
        @on-close="showEditDialog = false"
      >
        <template #button>
          <Button label="Salvează" @click="saveExperience()" />
        </template>
      </HandleExperiences>
    </Dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, onBeforeMount } from "vue";
  import { useExperienceStore } from "../../stores/experienceStore";
import { IExperience } from "@/Interfaces";
import HandleExperiences from "./HandleExperiences.vue";
  
  const experienceStore = useExperienceStore();
  const editingRows = ref();
  const showEditDialog = ref(false);
  
  function handleEditExperience(experience:IExperience) {
    experienceStore.selectedExperience = experience;
    showEditDialog.value = true;
  }
  
  function deleteExperience(id:number) {
    experienceStore.deleteExperience(id);
  }
  
  function getExperienceSearch() {
    experienceStore.getAllExperiences();
  }
  
  function saveExperience() {
    experienceStore.addExperience(experienceStore.selectedExperience);
  }
  
  onBeforeMount(async () => {
    await experienceStore.getAllExperiences();
  });
  </script>
  