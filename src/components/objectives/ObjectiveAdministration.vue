<template>
  <DataTable
    :value="objectiveStore.objectives"
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
        <div class="font-bold text-xl w-4">Gestionează obiectivele</div>
        <div class="flex w-full gap-4">
          <InputText
            v-model="objectiveStore.search"
            placeholder="Caută după nume"
            @input="getObjectiveSearch()"
          />
          <Button
            icon="pi pi-times"
            @click="
              objectiveStore.search = '';
              getObjectiveSearch();
            "
          />
        </div>
        <div class="flex justify-content-end">
          <Button
            rounded
            class="mx-2"
            icon="pi pi-file-import"
            @click="objectiveStore.importObjectives()"
          />
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
          <i
            class="pi pi-pencil"
            @click="handleEditObjective(slotProps.data)"
          ></i>
          <i
            class="pi pi-trash"
            @click="deleteObjective(slotProps.data.id)"
          ></i>
          <i
            class="pi pi-image"
            @click="
              objectiveStore.selectedObjective = slotProps.data;
              showGallery = true;
            "
          ></i>
        </div>
      </template>
    </Column>
  </DataTable>
  <Dialog
    v-model:visible="showGallery"
    maximizable
    modal
    :header="`Galeria obiectivului #${objectiveStore.selectedObjective.name}`"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="showGallery = false"
  >
    <ImageUpload
      :id-obiectiv="objectiveStore.selectedObjective.id"
      @uploaded="
        objectiveStore.getObjectives();
        showGallery = false;
      "
    />
    <PhotoGalleria
      :images="getImageSrc()"
      :onAdministration="true"
      @refresh="
        showGallery = false;
        objectiveStore.getObjectives();
      "
    />
  </Dialog>
</template>
<script setup lang="ts">
import { useObjectivesStore } from "../../stores/objectivesStore";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
onBeforeMount(async () => {
  await objectiveStore.getObjectives();
});
// const currentSetting = ref("");
const objectiveStore = useObjectivesStore();
const editingRows = ref();
const showEditDialog = ref(false);
const showGallery = ref(false);
function handleEditObjective(data: any) {
  objectiveStore.selectedObjective = data;
  showEditDialog.value = true;
}
async function deleteObjective(id: number) {
  await objectiveStore.deleteObjective(id);
  await objectiveStore.getObjectives();
}
async function getObjectiveSearch() {
  // useDebounceFn(async () => {
  await objectiveStore.getObjectives();
  // }, 500);
}
function getImageSrc() {
  return objectiveStore.selectedObjective.images.map((image,index) => ({
    itemImageSrc: image,
    thumbnailImageSrc: "",
    alt: `Imagine ${index + 1}`,
    title: `Imagine ${index + 1}`,
  }));
}
onBeforeUnmount(async () => {
  await objectiveStore.resetFilterData();
});
</script>
