<template>
  <Toast />
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
      <div class="flex justify-content-center flex-column">
        <label for="name">Nume itinerariu</label>
        <InputText v-model="itineraryStore.selectedItinerary.name" />
      </div>

      <div class="flex justify-content-center flex-column">
        <label for="description">Descriere itinerariu</label>
        <Textarea v-model="itineraryStore.selectedItinerary.description" rows="3" />
      </div>

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
          editMode="cell"
          dataKey="visitOrder"
          @row-reorder="onRowReorder"
          v-model:editingRows="editingRows"
          responsiveLayout="scroll"
          @cell-edit-complete="onCellEditComplete"
        >
          <Column :rowReorder="true" style="width: 3rem" />
          <Column field="visitOrder" header="Ordine" :sortable="false">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          
          <Column field="name" header="Nume">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
            <template #body="{ data }">
              <div class="editable-cell" @click="onCellClick($event, data, 'name')">
                {{ data.name }}
              </div>
            </template>
          </Column>

          <Column field="descriere" header="Descriere">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
            <template #body="{ data }">
              <div class="editable-cell" @click="onCellClick($event, data, 'descriere')">
                {{ data.descriere }}
              </div>
            </template>
          </Column>

          <Column field="idObjective" header="Obiectiv">
            <template #editor="{ data, field }">
              <Dropdown
                v-model="data[field]"
                :options="objectiveStore.objectives"
                optionLabel="name"
                optionValue="id"
                placeholder="Selectează obiectiv"
                autofocus
              />
            </template>
            <template #body="{ data }">
              <div class="editable-cell" @click="onCellClick($event, data, 'idObjective')">
                {{ getObjectiveName(data.idObjective) }}
              </div>
            </template>
          </Column>

          <Column field="idEvent" header="Eveniment">
            <template #editor="{ data, field }">
              <Dropdown
                v-model="data[field]"
                :options="eventStore.events"
                optionLabel="name"
                optionValue="id"
                placeholder="Selectează eveniment"
                autofocus
              />
            </template>
            <template #body="{ data }">
              <div class="editable-cell" @click="onCellClick($event, data, 'idEvent')">
                {{ getEventName(data.idEvent) }}
              </div>
            </template>
          </Column>

          <Column style="width: 10rem">
            <template #body="{ index }">
              <Button 
                icon="pi pi-trash" 
                class="p-button-danger p-button-text" 
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
import { useItineraryDetailStore } from '../../stores/itineraryDetailStore';
import type { IItineraryDetail } from '../../Interfaces';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const props = defineProps({
  showDialog: { type: Boolean, default: false },
});

const emits = defineEmits(['onClose']);
const dialogVisible = ref(false);
const saving = ref(false);
const toast = useToast();

const itineraryStore = useItineraryStore();
const objectiveStore = useObjectivesStore();
const eventStore = useEventsStore();
const itineraryDetailStore = useItineraryDetailStore();

const editingRows = ref({});

function addNewDetail() {
  const newDetail: IItineraryDetail = {
    name: '',
    descriere: '',
    visitOrder: itineraryStore.selectedItinerary.itineraryDetails.length + 1,
    idObjective: undefined,
    idEvent: undefined
  };
  itineraryStore.selectedItinerary.itineraryDetails.push(newDetail);
  editingRows.value = { [newDetail.visitOrder]: true };
}

async function removeDetail(index: number) {
  try {
    const detail = itineraryStore.selectedItinerary.itineraryDetails[index];
    if (detail.id) {
      const response = await itineraryDetailStore.deleteItineraryDetail(detail.id);
      if (response.isSuccesful) {
        itineraryStore.selectedItinerary.itineraryDetails.splice(index, 1);
        updateVisitOrder();
        toast.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Detaliul a fost șters cu succes',
          life: 3000
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Eroare',
          detail: response.validationMessage || 'A apărut o eroare la ștergerea detaliului',
          life: 3000
        });
      }
    } else {
      itineraryStore.selectedItinerary.itineraryDetails.splice(index, 1);
      updateVisitOrder();
      toast.add({
        severity: 'success',
        summary: 'Succes',
        detail: 'Detaliul a fost șters cu succes',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Eroare la ștergerea detaliului:', error);
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'A apărut o eroare la ștergerea detaliului',
      life: 3000
    });
  }
}

function onCellClick(event: Event, data: any, field: string) {
  event.preventDefault();
  const element = event.target as HTMLElement;
  if (!element.classList.contains('p-button')) {
    data.editing = true;
    editingRows.value = { [data.visitOrder]: true };
  }
}

function onRowReorder(event: any) {
  try {
    const details = [...itineraryStore.selectedItinerary.itineraryDetails];
    const movedItem = details.splice(event.dragIndex, 1)[0];
    details.splice(event.dropIndex, 0, movedItem);
    itineraryStore.selectedItinerary.itineraryDetails = details;
    updateVisitOrder();
    toast.add({
      severity: 'success',
      summary: 'Succes',
      detail: 'Ordinea detaliilor a fost actualizată',
      life: 3000
    });
  } catch (error) {
    console.error('Eroare la reordonarea detaliilor:', error);
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'A apărut o eroare la reordonarea detaliilor',
      life: 3000
    });
  }
}

function updateVisitOrder() {
  try {
    itineraryStore.selectedItinerary.itineraryDetails = 
      itineraryStore.selectedItinerary.itineraryDetails.map((detail, index) => ({
        ...detail,
        visitOrder: index + 1
      }));
  } catch (error) {
    console.error('Eroare la actualizarea ordinii:', error);
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'A apărut o eroare la actualizarea ordinii detaliilor',
      life: 3000
    });
  }
}

function getObjectiveName(id: number | undefined) {
  return objectiveStore.objectives.find(o => o.id === id)?.name || '';
}

function getEventName(id: number | undefined) {
  return eventStore.events.find(e => e.id === id)?.name || '';
}

async function onCellEditComplete(event: any) {
  const { data, newValue, field } = event;
  
  // Validare pentru toate câmpurile obligatorii
  if (field === 'name' && !newValue.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Numele detaliului nu poate fi gol',
      life: 3000
    });
    return;
  }

  if (field === 'idEvent' && !newValue) {
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Trebuie să selectați un eveniment',
      life: 3000
    });
    return;
  }
  
  const index = itineraryStore.selectedItinerary.itineraryDetails.findIndex(
    detail => detail.visitOrder === data.visitOrder
  );
  
  if (index !== -1) {
    try {
      const updatedDetail = { 
        ...itineraryStore.selectedItinerary.itineraryDetails[index],
        [field]: newValue 
      };
      
      if (updatedDetail.id) {
        const response = await itineraryDetailStore.updateItineraryDetail(updatedDetail);
        if (response.isSuccesful) {
          itineraryStore.selectedItinerary.itineraryDetails.splice(index, 1, updatedDetail);
          toast.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Detaliul a fost actualizat cu succes',
            life: 3000
          });
        } else {
          toast.add({
            severity: 'error',
            summary: 'Eroare',
            detail: response.validationMessage || 'A apărut o eroare la actualizarea detaliului',
            life: 3000
          });
        }
      } else {
        itineraryStore.selectedItinerary.itineraryDetails.splice(index, 1, updatedDetail);
        toast.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Detaliul a fost actualizat cu succes',
          life: 3000
        });
      }
    } catch (error) {
      console.error('Eroare la actualizarea detaliului:', error);
      toast.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'A apărut o eroare la actualizarea detaliului',
        life: 3000
      });
    }
  }
}

async function saveItinerary() {
  try {
    // Validare înainte de salvare
    const invalidDetails = itineraryStore.selectedItinerary.itineraryDetails.some(
      detail => !detail.name 
    );

    if (invalidDetails) {
      toast.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Toate câmpurile sunt obligatorii pentru fiecare detaliu al itinerariului',
        life: 3000
      });
      return;
    }

    saving.value = true;
    let response;
    
    if (itineraryStore.selectedItinerary.id) {
      response = await itineraryStore.updateItinerary();
    } else {
      response = await itineraryStore.addItinerary();
    }
    
    if (response.isSuccesful && response.result) {
      toast.add({
        severity: 'success',
        summary: 'Succes',
        detail: itineraryStore.selectedItinerary.id ? 
          'Itinerariul a fost actualizat cu succes' : 
          'Itinerariul a fost adăugat cu succes',
        life: 3000
      });
      dialogVisible.value = false;
      emits('onClose');
    } else {
      toast.add({
        severity: 'error',
        summary: 'Eroare',
        detail: response.validationMessage || 'A apărut o eroare la salvarea itinerariului',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Eroare la salvarea itinerariului:', error);
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'A apărut o eroare la salvarea itinerariului',
      life: 3000
    });
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

.editable-cell {
  cursor: pointer;
  padding: 0.5rem;
}

.editable-cell:hover {
  background-color: var(--surface-hover);
  border-radius: 4px;
}

:deep(.p-datatable-reorderablerow-handle) {
  cursor: move;
}
</style>