<template>
  <Toast />
  <div @click="dialogVisible = true">
    <slot name="button"></slot>
  </div>
  <Dialog
    v-model:visible="dialogVisible"
    maximizable
    modal
    :header="isEditMode ? 'Editează itinerariu' : 'Adaugă itinerariu'"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="closeDialog()"
  >
    <div class="flex flex-column gap-3">
      <div class="flex justify-content-center flex-column">
        <label for="name">Nume itinerariu</label>
        <InputText v-model="localItinerary.name" />
      </div>

      <div class="flex justify-content-center flex-column">
        <label for="description">Descriere itinerariu</label>
        <Textarea v-model="localItinerary.description" rows="3" />
      </div>

      <div class="flex justify-content-center flex-column">
        <label for="startDate">Data început</label>
        <Calendar v-model="localItinerary.startDate" dateFormat="dd/mm/yy" />
      </div>

      <div class="flex justify-content-center flex-column">
        <label for="endDate">Data sfârșit</label>
        <Calendar v-model="localItinerary.endDate" dateFormat="dd/mm/yy" />
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
          v-model:value="localItinerary.itineraryDetails"
          editMode="row"
          dataKey="visitOrder"
          @row-reorder="onRowReorder"
          v-model:editingRows="editingRows"
          responsiveLayout="scroll"
          @row-edit-init="onRowEditInit"
          @row-edit-cancel="onRowEditCancel"
          @row-edit-save="onRowEditSave"
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
          </Column>

          <Column field="descriere" header="Descriere">
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus />
            </template>
          </Column>

          <Column field="idObjective" header="Obiectiv">
            <template #editor="{ data, field }">
              <Dropdown
                v-model="data[field]"
                :options="objectiveStore.objectives"
                optionLabel="name"
                optionValue="id"
                filter
                placeholder="Selectează obiectiv"
                autofocus
              />
            </template>
            <template #body="{ data }">
              {{ getObjectiveName(data.idObjective) }}
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
              {{ getEventName(data.idEvent) }}
            </template>
          </Column>

          <Column
            :rowEditor="true"
            style="width: 10rem"
            bodyStyle="text-align:center"
          ></Column>
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
import { ref, onMounted, watch, computed } from "vue";
import { useItineraryStore } from "../../stores/itineraryStore";
import { useObjectivesStore } from "../../stores/objectivesStore";
import { useEventsStore } from "../../stores/eventStore";
import { useItineraryDetailStore } from "../../stores/itineraryDetailStore";
import type { IItineraryDetail, IItinerary } from "../../Interfaces";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import Calendar from "primevue/calendar";

const props = defineProps({
  showDialog: { type: Boolean, default: false },
});

const emits = defineEmits(["onClose"]);
const dialogVisible = ref(false);
const saving = ref(false);
const toast = useToast();

const itineraryStore = useItineraryStore();
const objectiveStore = useObjectivesStore();
const eventStore = useEventsStore();
const itineraryDetailStore = useItineraryDetailStore();

const editingRows = ref<IItineraryDetail[]>([]);
const localItinerary = ref<IItinerary>({
  id: 0,
  name: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  itineraryDetails: [],
});

const isEditMode = computed(
  () => (itineraryStore.selectedItinerary.id || 0) > 0
);

function addNewDetail() {
  const newDetail: IItineraryDetail = {
    name: "",
    descriere: "",
    visitOrder: localItinerary.value.itineraryDetails.length + 1,
    idObjective: undefined,
    idEvent: undefined,
  };
  localItinerary.value.itineraryDetails.push(newDetail);
  editingRows.value = [newDetail];
}

function onRowEditInit(event: any) {
  editingRows.value = [event.data];
}

function onRowEditCancel(event: any) {
  editingRows.value = [];
}

async function onRowEditSave(event: any) {
  if (isEditMode.value) {
    if (event.data.id) {
      await itineraryDetailStore.updateItineraryDetail(event.data);
    } else {
      event.data.idItinerary = itineraryStore.selectedItinerary.id;
      await itineraryDetailStore.addItineraryDetail(event.data);
    }
  }
}

async function removeDetail(index: number) {
  try {
    const detail = localItinerary.value.itineraryDetails[index];
    if (isEditMode.value && detail.id) {
      const response = await itineraryDetailStore.deleteItineraryDetail(
        detail.id
      );
      if (response.isSuccesful) {
        localItinerary.value.itineraryDetails.splice(index, 1);
        updateVisitOrder();
        toast.add({
          severity: "success",
          summary: "Succes",
          detail: "Detaliul a fost șters cu succes",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Eroare",
          detail:
            response.validationMessage ||
            "A apărut o eroare la ștergerea detaliului",
          life: 3000,
        });
      }
    } else {
      localItinerary.value.itineraryDetails.splice(index, 1);
      updateVisitOrder();
    }
  } catch (error) {
    console.error("Eroare la ștergerea detaliului:", error);
    toast.add({
      severity: "error",
      summary: "Eroare",
      detail: "A apărut o eroare la ștergerea detaliului",
      life: 3000,
    });
  }
}

async function onRowReorder(event: any) {
  const details = [...localItinerary.value.itineraryDetails];
  const movedItem = details.splice(event.dragIndex, 1)[0];
  details.splice(event.dropIndex, 0, movedItem);
  localItinerary.value.itineraryDetails = details;
  updateVisitOrder();
  if (isEditMode.value) {
    for (const detail of localItinerary.value.itineraryDetails) {
      if (detail.id) {
        await itineraryDetailStore.updateItineraryDetail(detail);
      }
    }
  }
}

function updateVisitOrder() {
  localItinerary.value.itineraryDetails =
    localItinerary.value.itineraryDetails.map((detail, index) => ({
      ...detail,
      visitOrder: index + 1,
    }));
}

function getObjectiveName(id: number | undefined) {
  return objectiveStore.objectives.find((o) => o.id === id)?.name || "";
}

function getEventName(id: number | undefined) {
  return eventStore.events.find((e) => e.id === id)?.name || "";
}

async function saveItinerary() {
  try {
    localItinerary.value.itineraryDetails.some((detail) => !detail.name);

    saving.value = true;

    if (isEditMode.value) {
      // Actualizare itinerariu existent
      itineraryStore.selectedItinerary = { ...localItinerary.value };
      await itineraryStore.updateItinerary();

      // Actualizare detalii
      for (const detail of localItinerary.value.itineraryDetails) {
        if (detail.id) {
          await itineraryDetailStore.updateItineraryDetail(detail);
        } else {
          await itineraryDetailStore.addItineraryDetail({
            ...detail,
            idItinerary: itineraryStore.selectedItinerary.id,
          });
        }
      }
    } else {
      // Adăugare itinerariu nou
      itineraryStore.selectedItinerary = { ...localItinerary.value };
      await itineraryStore.addItinerary();

      // Adăugare detalii pentru noul itinerariu
      for (const detail of localItinerary.value.itineraryDetails) {
        await itineraryDetailStore.addItineraryDetail({
          ...detail,
          idItinerary: itineraryStore.selectedItinerary.id,
        });
      }
    }

    dialogVisible.value = false;
    emits("onClose");
  } catch (error) {
    console.error("Eroare la salvarea itinerariului:", error);
    toast.add({
      severity: "error",
      summary: "Eroare",
      detail: "A apărut o eroare la salvarea itinerariului",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
}

function closeDialog() {
  dialogVisible.value = false;
  emits("onClose");
}

watch(
  () => props.showDialog,
  (newVal: boolean) => {
    dialogVisible.value = newVal;
  }
);

watch(
  () => itineraryStore.selectedItinerary,
  (newVal) => {
    if (newVal.id && newVal.id > 0) {
      localItinerary.value = { ...newVal };
    } else {
      localItinerary.value = {
        id: 0,
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        itineraryDetails: [],
      };
    }
  },
  { immediate: true }
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

:deep(.p-datatable-reorderablerow-handle) {
  cursor: move;
}
</style>
