<template>
    <DataTable
      :value="objectiveTypeStore.objectiveTypes"
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
            <div class="font-bold text-xl">Gestionează tipurile de obiective</div>
            <InputText
              v-model="objectiveTypeStore.search"
              placeholder="Caută după nume"
              class="w-8"
              @input="getObjectiveTypeSearch()"
            />
          </div>
          <div class="flex justify-content-end">
            <HandleObjectiveTypes
              :show-dialog="showEditDialog"
              @on-close="showEditDialog = false"
            >
              <template #button>
                <Button
                  icon="pi pi-plus"
                  label="Adaugă"
                  @click="objectiveTypeStore.resetSelectedObjectiveType()"
                />
              </template>
            </HandleObjectiveTypes>
          </div>
        </div>
      </template>
      <Column field="id" header="Id"> </Column>
      <Column field="name" header="Nume">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>
      <Column field="description" header="Descriere">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>
      <Column style="width: 10%; min-width: 8rem" header="Acțiuni">
        <template #body="slotProps">
          <div class="flex gap-3">
            <i
              class="pi pi-pencil"
              @click="handleEditObjectiveType(slotProps.data)"
            ></i>
            <i
              class="pi pi-trash"
              @click="deleteObjectiveType(slotProps.data.id)"
            ></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </template>
  
  <script setup lang="ts">
  import { useObjectiveTypeStore } from "../../stores/objectiveTypeStore";
  import { ref, onBeforeMount } from "vue";
  
  const objectiveTypeStore = useObjectiveTypeStore();
  const editingRows = ref();
  const showEditDialog = ref(false);
  
  onBeforeMount(async () => {
    await objectiveTypeStore.getObjectiveTypes();
  });
  
  function handleEditObjectiveType(data: any) {
    objectiveTypeStore.selectedObjectiveType = data;
    showEditDialog.value = true;
  }
  
  async function deleteObjectiveType(id: number) {
    await objectiveTypeStore.deleteObjectiveType(id);
    await objectiveTypeStore.getObjectiveTypes();
  }
  
  async function getObjectiveTypeSearch() {
    await objectiveTypeStore.getObjectiveTypes();
  }
  </script>
  