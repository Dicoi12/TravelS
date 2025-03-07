<template>
    <DataTable
      :value="itineraryStore.itineraries"
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
            <div class="font-bold text-xl">Gestionează itinerariile prestabilite</div>
            <InputText
              placeholder="Caută după nume"
              class="w-8"
              @input="getItinerarySearch()"
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
                  @click="itineraryStore.resetItinerary()"
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
            <i class="pi pi-trash" @click="deleteEvent(slotProps.data.id)"></i>
            <i
              class="pi pi-image"
              @click="
                itineraryStore.selectedItinerary = slotProps.data;
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
        itineraryStore.selectedItinerary.id == 0
          ? 'Adaugă itinerariu'
          : 'Editează itinerariu'
      "
      :modal="true"
      :closable="false"
    >
      <HandleIt
        :show-dialog="showEditDialog"
        @on-close="showEditDialog = false"
      >
        <template #button>
          <Button label="Salvează" @click="saveEvent()" />
        </template>
    </HandleIt>
    </Dialog>
    <!-- <Dialog
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
      <PhotoGalleria :images="getImageSrc()" />
    </Dialog> -->
  </template>
  <script setup lang="ts">
  import { onBeforeMount, ref } from "vue";
  import {  IItinerary } from "../../Interfaces";
  import { useHelperStore } from "../../stores/helperStore";
  import { useItineraryStore } from "../../stores/itineraryStore";

  const itineraryStore= useItineraryStore();
  const helperStore = useHelperStore();
  const editingRows = ref();
  const showEditDialog = ref(false);
  const showGallery = ref(false);
  
  function handleEditEvent(event: IItinerary) {
    itineraryStore.selectedItinerary = event;
    showEditDialog.value = true;
  }
  function deleteEvent(id: number) {
    // itineraryStore.deleteEvent(id);
  }
  function getItinerarySearch() {
    // itineraryStore.getItineraries();
  }
  onBeforeMount(async () => {
    // await eventStore.getEvents();
  });
 async function saveEvent() {
   await itineraryStore.addItinerary();
  }
  // function getImageSrc() {
  //   // return eventStore.selectedEvent.images.map((image) => ({
  //   //   itemImageSrc: image,
  //   //   thumbnailImageSrc: "",
  //   //   alt: "Description for Image 1",
  //   //   title: "Title 1",
  //   // }));
  //   return;
  // }
  </script>
  