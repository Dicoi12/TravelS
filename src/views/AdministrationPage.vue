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
    <div class="w-full h-max bg-white mt-7 m-4 border-round-xl">
      <!-- <div v-if="currentSetting == 'Obiective'"> -->
      <DataTable
        :value="objectiveStore.objectives"
        v-model:editingRows="editingRows"
        editMode="row"
        scrollable
        scrollHeight="45rem"
      >
        <template #header>
          <div class="flex justify-content-between">
            <div class="font-bold text-xl">Gestionează obiectivele</div>
            <div class="flex justify-content-end">
              <HandleObjectives
                :show-dialog="showEditDialog"
                @on-close="showEditDialog = false"
              >
                <template #button>
                  <Button
                    icon="pi pi-plus"
                    label="Adaugă"
                    @click="objectiveStore.resetSelectedObjective()"
                  />
                </template>
              </HandleObjectives>
            </div>
          </div>
        </template>
        <Column field="id" header="Id"> </Column>
        <Column field="name" header="Nume">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template> </Column
        ><Column field="city" header="Oraș">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="description" header="Descriere">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid /> </template
        ></Column>
        <Column field="latitude" header="Latitudine">
          <template #editor="{ data, field }">
            <InputNumber v-model="data[field]" fluid /> </template
        ></Column>
        <Column field="longitude" header="Longitudine">
          <template #editor="{ data, field }">
            <InputNumber v-model="data[field]" fluid /> </template
        ></Column>
        <Column style="width: 10%; min-width: 8rem" header="Acțiuni">
          <template #body="data">
            <div class="flex gap-3">
              <i
                class="pi pi-pencil"
                @click="handleEditObjective(data.data)"
              ></i>
              <i class="pi pi-trash" @click="deleteObjective(data.data.id)"></i>
              <i class="pi pi-image" @click="showGallery = true"></i>
            </div>
          </template>
        </Column>
      </DataTable>
      <!-- </div> -->
    </div>
  </div>
  <Dialog
    v-model:visible="showGallery"
    maximizable
    modal
    :header="`Galeria obiectivului #${objectiveStore.selectedObjective.name}`"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="showGallery = false"
  >
    <PhotoGalleria :images="getImageSrc()" />
  </Dialog>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import PanelMenu from "primevue/panelmenu";
import { useObjectivesStore } from "../stores/objectivesStore";
import { IPhotoGalleria } from "../Interfaces";

const expandedKeys = ref();
// const currentSetting = ref("");
const objectiveStore = useObjectivesStore();
const editingRows = ref();
const showEditDialog = ref(false);
const showGallery = ref(false);
const items = ref([
  {
    label: "Obiective",
    icon: "pi pi-map-marker",
  },
  {
    label: "Evenimente",
    icon: "pi pi-map",
  },
  {
    label: "Itinerarii",
    icon: "pi pi-directions-alt",
  },
]);
onBeforeMount(async () => {
  await objectiveStore.getObjectives();
});
function handleEditObjective(data: any) {
  objectiveStore.selectedObjective = data;
  showEditDialog.value = true;
}
async function deleteObjective(id: number) {
  await objectiveStore.deleteObjective(id);
  await objectiveStore.getObjectives();
}
function getImageSrc(): IPhotoGalleria[] {
  return objectiveStore.selectedObjective.images.map((image) => ({
    itemImageSrc: image,
    thumbnailImageSrc: '',
    alt: "Description for Image 1",
    title: "Title 1",
  }));
}
</script>
