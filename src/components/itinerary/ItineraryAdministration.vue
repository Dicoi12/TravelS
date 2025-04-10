<template>
    <DataTable
      :value="filteredItineraries"
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
            <HandleIt
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
            </HandleIt>
          </div>
        </div>
      </template>
      <Column field="id" header="Id" style="width: 5rem"></Column>
      <Column field="name" header="Nume" style="width: 15rem"></Column>
      <Column field="description" header="Descriere" style="width: 20rem"></Column>
      <Column header="Obiective și Evenimente" style="width: 25rem">
        <template #body="{ data }">
          <div v-if="data.itineraryDetails && data.itineraryDetails.length > 0">
            <div v-for="detail in data.itineraryDetails" :key="detail.visitOrder" class="mb-2">
              <div v-if="detail.idObjective" class="flex align-items-center gap-2">
                <i class="pi pi-map-marker"></i>
                <span>{{ getObjectiveName(detail.idObjective) }}</span>
              </div>
              <div v-if="detail.idEvent" class="flex align-items-center gap-2">
                <i class="pi pi-calendar"></i>
                <span>{{ getEventName(detail.idEvent) }}</span>
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
          {{ formatDate(data.createdAt) }}
        </template>
      </Column>
      <Column field="updatedAt" header="Ultima actualizare" style="width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.updatedAt) }}
        </template>
      </Column>
      <Column style="width: 10rem" header="Acțiuni">
        <template #body="slotProps">
          <div class="flex gap-3">
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded"
              @click="handleEdit(slotProps.data)"
              title="Editează"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-rounded p-button-danger"
              @click="confirmDelete(slotProps.data)"
              title="Șterge"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Toast position="bottom-right" />
    <ConfirmDialog />
  </template>
  <script setup lang="ts">
  import { onBeforeMount, ref, computed } from "vue";
  import { useItineraryStore } from "../../stores/itineraryStore";
  import { useObjectivesStore } from "../../stores/objectivesStore";
  import { useEventsStore } from "../../stores/eventStore";
  import HandleIt from "./HandleIt.vue";
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import type { IItinerary } from '../../Interfaces';
  import ConfirmDialog from 'primevue/confirmdialog';

  const itineraryStore = useItineraryStore();
  const objectiveStore = useObjectivesStore();
  const eventStore = useEventsStore();
  const editingRows = ref();
  const showEditDialog = ref(false);
  const confirm = useConfirm();
  const toast = useToast();
  const searchQuery = ref('');
  
  const filteredItineraries = computed(() => {
    if (!searchQuery.value) return itineraryStore.itineraries;
    const query = searchQuery.value.toLowerCase();
    return itineraryStore.itineraries.filter(itinerary => 
      itinerary.name.toLowerCase().includes(query) ||
      itinerary.description.toLowerCase().includes(query)
    );
  });

  function formatDate(date: string | Date | undefined) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getObjectiveName(id: number | undefined) {
    return objectiveStore.objectives.find(o => o.id === id)?.name || '';
  }

  function getEventName(id: number | undefined) {
    return eventStore.events.find(e => e.id === id)?.name || '';
  }

  function handleAddNew() {
    itineraryStore.resetSelectedItinerary();
    showEditDialog.value = true;
  }

  function handleEdit(itinerary: IItinerary) {
    itineraryStore.selectedItinerary = { ...itinerary };
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
      const response = await itineraryStore.deleteItinerary(itinerary.id || 0);
      
      if (response.isSuccesful) {
        toast.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Itinerariul a fost șters cu succes',
          life: 3000
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Eroare',
          detail: response.validationMessage || 'A apărut o eroare la ștergerea itinerariului',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Eroare la ștergerea itinerariului:', error);
      toast.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'A apărut o eroare la ștergerea itinerariului',
        life: 3000
      });
    }
  }

  onBeforeMount(async () => {
    try {
      await Promise.all([
        itineraryStore.getItineraries(),
        objectiveStore.getObjectives(),
        eventStore.getEvents()
      ]);
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
      toast.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'A apărut o eroare la încărcarea datelor',
        life: 3000
      });
    }
  });
</script>

<style scoped>
.p-button-text {
  padding: 0.5rem;
}

.p-button-text:hover {
  background: var(--surface-hover);
}
</style>
  