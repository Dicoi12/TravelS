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
      :loading="itineraryStore.loading"
    >
      <template #header>
        <div class="flex justify-content-between">
          <div class="flex w-full gap-3">
            <div class="font-bold text-xl">Gestionează itinerariile</div>
            <InputText
              v-model="searchQuery"
              placeholder="Caută după nume"
              class="w-8"
            />
          </div>
          <div class="flex justify-content-end">
            <HandleItinerary
              :show-dialog="showEditDialog"
              @on-close="closeDialog"
            >
              <template #button>
                <Button
                  icon="pi pi-plus"
                  label="Adaugă"
                  @click="handleAddNew"
                />
              </template>
            </HandleItinerary>
          </div>
        </div>
      </template>
      <Column field="id" header="Id" style="width: 5rem"></Column>
      <Column field="name" header="Nume" style="width: 15rem"></Column>
      <Column field="description" header="Descriere" style="width: 20rem"></Column>
      
      <!-- Detalii Itinerariu -->
      <Column header="Obiective și Evenimente" style="width: 25rem">
        <template #body="{ data }">
          <div v-if="data.itineraryDetails && data.itineraryDetails.length > 0">
            <div v-for="detail in data.itineraryDetails" :key="detail.id" class="mb-2">
              <div v-if="detail.objective" class="flex align-items-center gap-2">
                <i class="pi pi-map-marker"></i>
                <span>{{ detail.objective.name }}</span>
              </div>
              <div v-if="detail.event" class="flex align-items-center gap-2">
                <i class="pi pi-calendar"></i>
                <span>{{ detail.event.name }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 italic">
            Nu există detalii
          </div>
        </template>
      </Column>

      <!-- Data creării -->
      <Column field="createdAt" header="Data creării" style="width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.itineraryDetails[0]?.createdAt) }}
        </template>
      </Column>

      <!-- Data actualizării -->
      <Column field="updatedAt" header="Ultima actualizare" style="width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.itineraryDetails[0]?.updatedAt) }}
        </template>
      </Column>

      <!-- Acțiuni -->
      <Column style="width: 10rem" header="Acțiuni">
        <template #body="slotProps">
          <div class="flex gap-3">
            <i class="pi pi-pencil cursor-pointer" 
               @click="handleEdit(slotProps.data)"
               title="Editează"
            ></i>
            <i class="pi pi-trash cursor-pointer" 
               @click="confirmDelete(slotProps.data)"
               title="Șterge"
            ></i>
            <i class="pi pi-list cursor-pointer"
               @click="showDetails(slotProps.data)"
               title="Vezi detalii"
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
        @on-close="closeDialog"
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
    <!-- Error Message Toast -->
    <Toast position="bottom-right" />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog>
      <template #message="slotProps">
        <div class="flex flex-column gap-2">
          {{ slotProps.message }}
        </div>
      </template>
    </ConfirmDialog>

    <!-- Dialog pentru detalii -->
    <Dialog 
      v-model:visible="showDetailsDialog" 
      header="Detalii itinerariu"
      :style="{ width: '50rem' }"
      modal
    >
      <div v-if="selectedItineraryForDetails">
        <h3>{{ selectedItineraryForDetails.name }}</h3>
        <p>{{ selectedItineraryForDetails.description }}</p>
        
        <h4 class="mt-4">Obiective și Evenimente</h4>
        <div v-for="detail in selectedItineraryForDetails.itineraryDetails" :key="detail.id">
          <div v-if="detail.objective">
            <i class="pi pi-map-marker"></i>
            <span>{{ detail.objective.name }}</span>
          </div>
          <div v-if="detail.event">
            <i class="pi pi-calendar"></i>
            <span>{{ detail.event.name }}</span>
          </div>
        </div>
      </div>
    </Dialog>
  </template>
  <script setup lang="ts">
  import { onBeforeMount, ref, onMounted } from "vue";
  import { useHelperStore } from "../../stores/helperStore";
  import { useItineraryStore } from "../../stores/itineraryStore";
  import HandleIt from "./HandleIt.vue";
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import type { IItineraryPageDTO, IItineraryDTO } from '../../Interfaces';
  import ConfirmDialog from 'primevue/confirmdialog';

  const itineraryStore= useItineraryStore();
  const helperStore = useHelperStore();
  const editingRows = ref();
  const showEditDialog = ref(false);
  const showGallery = ref(false);
  const confirm = useConfirm();
  const toast = useToast();
  const searchQuery = ref('');
  const showDetailsDialog = ref(false);
  const selectedItineraryForDetails = ref<IItineraryDTO | null>(null);
  
  function handleEditItinerary(data: any) {
    itineraryStore.setSelectedItinerary(data);
    showEditDialog.value = true;
  }
  async function deleteItinerary(id: number) {
    // await itineraryStore.deleteItinerary(id);
    // await itineraryStore.getItineraries();
  }
  async function getItinerarySearch() {
    // await itineraryStore.getItineraries();
  }
  onBeforeMount(async () => {
    // await itineraryStore.getItineraries();
  });
 async function saveEvent() {
   await itineraryStore.addOrUpdateItinerary(itineraryStore.selectedItinerary);
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

  // Formatare dată
  function formatDate(date: string | Date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Handlers
  function handleAddNew() {
    itineraryStore.resetSelectedItinerary();
    showEditDialog.value = true;
  }

  function handleEdit(itinerary: IItineraryPageDTO) {
    itineraryStore.setSelectedItinerary(itinerary);
    showEditDialog.value = true;
  }

  function closeDialog() {
    showEditDialog.value = false;
    itineraryStore.resetSelectedItinerary();
  }

  function confirmDelete(itinerary: IItineraryPageDTO) {
    confirm.require({
      message: `Sunteți sigur că doriți să ștergeți itinerariul "${itinerary.name}"?`,
      header: 'Confirmare ștergere',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(itinerary)
    });
  }

  async function handleDelete(itinerary: IItineraryPageDTO) {
    try {
      // Presupunem că avem userId în aplicație, poate din auth store
      const userId = 1; // Înlocuiți cu userId-ul real din aplicație
      const success = await itineraryStore.deleteItineraryByUser(itinerary.id, userId);
      
      if (success) {
        toast.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Itinerariul a fost șters cu succes',
          life: 3000
        });
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'A apărut o eroare la ștergerea itinerariului',
        life: 3000
      });
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    try {
      await itineraryStore.getAllItineraries();
    } catch (error) {
      console.error('Eroare la încărcarea itinerariilor:', error);
    }
  });
</script>
  