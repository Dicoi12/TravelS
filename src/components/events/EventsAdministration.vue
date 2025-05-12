<template>
  <DataTable
    :value="eventStore.events"
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
          <div class="font-bold text-xl">Gestionează evenimentele</div>
          <InputText
            v-model="eventStore.search"
            placeholder="Caută după nume"
            class="w-8"
            @input="getEventSearch()"
          />
        </div>
        <div class="flex justify-content-end">
          <HandleEvents
            :show-dialog="showEditDialog"
            @on-close="showEditDialog = false"
          >
            <template #button>
              <Button
                icon="pi pi-plus"
                label="Adaugă"
                @click="eventStore.resetSelectedEvent()"
              />
            </template>
          </HandleEvents>
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
        <InputNumber v-model="data[field]" fluid /> </template></Column
    ><Column field="startDate" header="Data de începere">
      <template #body="{ data }">
        {{ helperStore.formatDate(new Date(data.startDate)) }}
      </template></Column
    >
    <Column field="endDate" header="Data de încheiere">
      <template #body="{ data }">
        {{ helperStore.formatDate(new Date(data.endDate)) }}
      </template></Column
    >
    <Column style="width: 10%; min-width: 8rem" header="Acțiuni">
      <template #body="slotProps">
        <div class="flex gap-3">
          <i class="pi pi-pencil" @click="handleEditEvent(slotProps.data)"></i>
          <i class="pi pi-trash" @click="confirmDelete(slotProps.data.id)"></i>
          <i
            class="pi pi-image"
            @click="
              eventStore.selectedEvent = slotProps.data;
              console.log(eventStore.selectedEvent);
              showGallery = true;
            "
          ></i>
        </div>
      </template>
    </Column>
  </DataTable>
  <Dialog
    v-model:visible="showEditDialog"
    :header="
      eventStore.selectedEvent.id == 0
        ? 'Adaugă eveniment'
        : 'Editează eveniment'
    "
    :modal="true"
    :closable="false"
  >
    <HandleEvents
      :show-dialog="showEditDialog"
      @on-close="showEditDialog = false"
    >
      <template #button>
        <Button label="Salvează" @click="saveEvent()" />
      </template>
    </HandleEvents>
  </Dialog>
  <Dialog
    v-model:visible="showGallery"
    maximizable
    modal
    :header="`Galeria evenimentului #${eventStore.selectedEvent.name}`"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="showGallery = false"
  >
    <ImageUpload
      :id-eveniment="eventStore.selectedEvent.id"
      @uploaded="
        eventStore.getEvents();
        showGallery = false;
      "
    />
    <PhotoGalleria :images="getImageSrc()" :onAdministration="true" @refresh="showGallery = false;eventStore.getEvents()" />
  </Dialog>
  <Dialog
    v-model:visible="showDeleteDialog"
    :modal="true"
    header="Confirmare ștergere"
    :style="{ width: '30rem' }"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Sunteți sigur că doriți să ștergeți acest eveniment?</span>
    </div>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button label="Nu" icon="pi pi-times" @click="showDeleteDialog = false" class="p-button-text" />
        <Button label="Da" icon="pi pi-check" @click="deleteEvent()" class="p-button-danger" />
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { useEventsStore } from "../../stores/eventStore";
import { onBeforeMount, ref } from "vue";
import { IEvent } from "../../Interfaces";
import { useHelperStore } from "../../stores/helperStore";

const helperStore = useHelperStore();
const eventStore = useEventsStore();
const editingRows = ref();
const showEditDialog = ref(false);
const showGallery = ref(false);
const showDeleteDialog = ref(false);
const eventToDelete = ref<number | null>(null);

function handleEditEvent(event: IEvent) {
  eventStore.selectedEvent = event;
  showEditDialog.value = true;
}

function confirmDelete(id: number) {
  eventToDelete.value = id;
  showDeleteDialog.value = true;
}

function deleteEvent() {
  if (eventToDelete.value) {
    eventStore.deleteEvent(eventToDelete.value);
    showDeleteDialog.value = false;
    eventToDelete.value = null;
  }
}

function getEventSearch() {
  eventStore.getEvents();
}
onBeforeMount(async () => {
  await eventStore.getEvents();
});
function saveEvent() {
  eventStore.addEvent(eventStore.selectedEvent);
}
function getImageSrc() {
  return eventStore.selectedEvent.images.map((image) => ({
    itemImageSrc: image,
    thumbnailImageSrc: "",
    alt: "Description for Image 1",
    title: "Title 1",
  }));
}
</script>
