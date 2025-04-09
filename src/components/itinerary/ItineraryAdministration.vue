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
            <div class="font-bold text-xl">Gestionează itinerariile</div>
            <InputText
              v-model="searchQuery"
              placeholder="Caută după nume"
              class="w-8"
            />
          </div>
          <div class="flex justify-content-end">
            <Button
                  icon="pi pi-plus"
                  label="Adaugă"
                  @click="handleAddNew"
                />
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
      <Column field="createdAt" header="Data creării" style="width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.itineraryDetails[0]?.createdAt) }}
        </template>
      </Column>
      <Column field="updatedAt" header="Ultima actualizare" style="width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.itineraryDetails[0]?.updatedAt) }}
        </template>
      </Column>
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
          </div>
        </template>
      </Column>
    </DataTable>
      <HandleIt
        :show-dialog="showEditDialog"
        @on-close="closeDialog"
      >
    </HandleIt>
    <Toast position="bottom-right" />

    <ConfirmDialog>
      <template #message="slotProps">
        <div class="flex flex-column gap-2">
          {{ slotProps.message }}
        </div>
      </template>
    </ConfirmDialog>
  </template>
  <script setup lang="ts">
  import { onBeforeMount, ref, onMounted } from "vue";
  import { useItineraryStore } from "../../stores/itineraryStore";
  import HandleIt from "./HandleIt.vue";
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import type { IItinerary } from '../../Interfaces';
  import ConfirmDialog from 'primevue/confirmdialog';

  const itineraryStore= useItineraryStore();
  const editingRows = ref();
  const showEditDialog = ref(false);
  const confirm = useConfirm();
  const toast = useToast();
  const searchQuery = ref('');
  
  onBeforeMount(async () => {
    await itineraryStore.getItineraries();
  });
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
  function handleAddNew() {
    itineraryStore.resetSelectedItinerary();
    showEditDialog.value = true;
  }

  function handleEdit(itinerary: IItinerary) {
    itineraryStore.selectedItinerary = itinerary;
    showEditDialog.value = true;
  }

  function closeDialog() {
    showEditDialog.value = false;
    itineraryStore.resetSelectedItinerary();
  }

  function confirmDelete(itinerary: IItinerary) {
    confirm.require({
      message: `Sunteți sigur că doriți să ștergeți itinerariul "${itinerary.name}"?`,
      header: 'Confirmare ștergere',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(itinerary)
    });
  }

  async function handleDelete(itinerary: IItinerary) {
    try {
      const success = await itineraryStore.deleteItinerary(itinerary.id);
      
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

  onMounted(async () => {
    try {
      await itineraryStore.getItineraries();
    } catch (error) {
      console.error('Eroare la încărcarea itinerariilor:', error);
    }
  });
</script>
  