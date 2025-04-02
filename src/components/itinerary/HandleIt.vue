<template>
  <div @click="dialogVisible = true">
    <slot name="button"></slot>
  </div>
  <Dialog
    v-model:visible="dialogVisible"
    maximizable
    modal
    :header="itineraryStore.selectedItinerary.id ? 'Editează itinerariu' : 'Adaugă itinerariu'"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="closeDialog()"
  >
    <div class="flex flex-column gap-3">
      <!-- Informații de bază itinerariu -->
      <div class="flex justify-content-center flex-column">
        <label for="name">Nume itinerariu</label>
        <InputText v-model="itineraryStore.selectedItinerary.name" />
      </div>

      <div class="flex justify-content-center flex-column">
        <label for="description">Descriere itinerariu</label>
        <Textarea v-model="itineraryStore.selectedItinerary.description" rows="3" />
      </div>

      <!-- Tabel pentru detalii itinerariu -->
      <div class="card">
        <h3>Detalii itinerariu</h3>
        <Button 
          icon="pi pi-plus" 
          label="Adaugă detaliu" 
          @click="addNewDetail"
          class="mb-3"
        />

        <DataTable 
          v-model:value="itineraryStore.selectedItinerary.itineraryDetails"
          editMode="row"
          dataKey="visitOrder"
          :reorderableRows="true"
          @row-reorder="onRowReorder"
        >
          <Column :rowReorder="true" style="width: 3rem" />
          <Column field="visitOrder" header="Ordine">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          
          <Column field="name" header="Nume">
            <template #editor="{ data }">
              <InputText v-model="data.name" />
            </template>
          </Column>

          <Column field="descriere" header="Descriere">
            <template #editor="{ data }">
              <InputText v-model="data.descriere" />
            </template>
          </Column>

          <Column field="idObjective" header="Obiectiv">
            <template #editor="{ data }">
              <Dropdown
                v-model="data.idObjective"
                :options="objectiveStore.objectives"
                optionLabel="name"
                optionValue="id"
                placeholder="Selectează obiectiv"
              />
            </template>
            <template #body="{ data }">
              {{ getObjectiveName(data.idObjective) }}
            </template>
          </Column>

          <Column field="idEvent" header="Eveniment">
            <template #editor="{ data }">
              <Dropdown
                v-model="data.idEvent"
                :options="eventStore.events"
                optionLabel="name"
                optionValue="id"
                placeholder="Selectează eveniment"
              />
            </template>
            <template #body="{ data }">
              {{ getEventName(data.idEvent) }}
            </template>
          </Column>

          <Column style="width: 10rem">
            <template #body="{ data, index }">
              <Button 
                icon="pi pi-trash" 
                class="p-button-danger" 
                @click="removeDetail(index)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button 
          label="Anulează" 
          icon="pi pi-times" 
          @click="closeDialog()" 
          class="p-button-text"
        />
        <Button 
          label="Salvează" 
          icon="pi pi-check" 
          @click="saveItinerary()" 
          :loading="saving"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useItineraryStore } from '../../stores/itineraryStore';
import { useObjectivesStore } from '../../stores/objectivesStore';
import { useEventsStore } from '../../stores/eventStore';
import type { IItineraryDetail } from '../../Interfaces';

const props = defineProps({
  showDialog: { type: Boolean, default: false },
});

const emits = defineEmits(['onClose']);
const dialogVisible = ref(false);
const saving = ref(false);

const itineraryStore = useItineraryStore();
const objectiveStore = useObjectivesStore();
const eventStore = useEventsStore();

function addNewDetail() {
  const newDetail: IItineraryDetail = {
    name: '',
    descriere: '',
    visitOrder: itineraryStore.selectedItinerary.itineraryDetails.length + 1
  };
  itineraryStore.selectedItinerary.itineraryDetails.push(newDetail);
}

function removeDetail(index: number) {
  itineraryStore.selectedItinerary.itineraryDetails.splice(index, 1);
  updateVisitOrder();
}

function updateVisitOrder() {
  itineraryStore.selectedItinerary.itineraryDetails.forEach((detail, index) => {
    detail.visitOrder = index + 1;
  });
}

function onRowReorder(event: any) {
  updateVisitOrder();
}

function getObjectiveName(id: number) {
  return objectiveStore.objectives.find(o => o.id === id)?.name || '';
}

function getEventName(id: number) {
  return eventStore.events.find(e => e.id === id)?.name || '';
}

async function saveItinerary() {
  try {
    saving.value = true;
    await itineraryStore.addOrUpdateItinerary(itineraryStore.selectedItinerary);
    dialogVisible.value = false;
    emits('onClose');
  } catch (error) {
    console.error('Eroare la salvarea itinerariului:', error);
  } finally {
    saving.value = false;
  }
}

function closeDialog() {
  dialogVisible.value = false;
  emits('onClose');
}

watch(
  () => props.showDialog,
  (newVal: boolean) => {
    dialogVisible.value = newVal;
  }
);

onMounted(async () => {
  await objectiveStore.getObjectives();
  await eventStore.getEvents();
});
</script>

<style scoped>
.card {
  padding: 1rem;
  border-radius: 4px;
  background: var(--surface-card);
}
</style>