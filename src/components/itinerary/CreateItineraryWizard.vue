<template>
  <div class="create-itinerary-wizard">
    <div class="wizard-header">
      <h1 class="wizard-title">Creează un nou itinerariu</h1>
      <Steps :model="steps" :readonly="false" :activeIndex="currentStep" />
    </div>

    <div class="wizard-content">
      <!-- Pasul 1: Informații de bază -->
      <div v-if="currentStep === 0" class="step-content">
        <h2 class="step-title">Informații de bază</h2>
        <div class="p-card form-container">
          <div class="form-group">
            <label for="itinerary-name">Numele itinerarului</label>
            <InputText id="itinerary-name" v-model="itinerary.name" class="w-full" placeholder="Ex: Vacanță de vară în Cluj" />
            <small v-if="!itinerary.name && showValidation" class="p-error">Numele itinerarului este obligatoriu</small>
          </div>
          <div class="form-group">
            <label for="itinerary-description">Descriere</label>
            <Textarea id="itinerary-description" v-model="itinerary.description" rows="5" class="w-full" placeholder="Descrieți pe scurt acest itinerariu..." />
          </div>
          <div class="form-group">
            <label>Perioada planificată</label>
            <div class="date-range-picker">
              <Calendar v-model="startDate" :showIcon="true" placeholder="Data de început" />
              <Calendar v-model="endDate" :showIcon="true" placeholder="Data de sfârșit" :minDate="startDate || undefined" />
            </div>
          </div>
        </div>
      </div>

      <!-- Pasul 2: Selectarea obiectivelor -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">Selectează obiective și evenimente</h2>
        
        <div class="search-section p-card">
          <div class="filters-container">
            <span class="p-input-icon-left search-input">
              <i class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="Caută obiective sau evenimente..."
                class="w-full"
              />
            </span>
            <div class="filter-buttons">
              <SelectButton v-model="itemTypeFilter" :options="filterOptions" optionLabel="label" />
            </div>
          </div>
        </div>

        <div class="selection-container">
          <div class="p-card available-items">
            <h3 class="section-title">
              <i class="pi pi-list"></i> 
              Obiective disponibile
              <Badge :value="filteredItems.length" />
            </h3>
            <ScrollPanel class="custom-scrollpanel">
              <div class="items-list" v-if="filteredItems.length > 0">
                <div
                  v-for="item in filteredItems"
                  :key="item.id"
                  class="item-card p-card"
                  draggable="true"
                  @dragstart="onDragStart($event, item)"
                  @click="addItemToItinerary(item)"
                >
                  <div class="item-badge" :class="getItemType(item) === 'objective' ? 'objective-badge' : 'event-badge'">
                    {{ getItemType(item) === 'objective' ? 'Obiectiv' : 'Eveniment' }}
                  </div>
                  <img
                    :src="getItemImage(item)"
                    :alt="item.name"
                    class="item-image"
                  />
                  <div class="item-info">
                    <h4>{{ item.name }}</h4>
                    <p><i class="pi pi-map-marker"></i> {{ item.city }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="pi pi-search" style="font-size: 2rem"></i>
                <p>Nu am găsit rezultate pentru căutarea ta</p>
              </div>
            </ScrollPanel>
          </div>

          <div
            class="p-card current-itinerary"
            @dragover.prevent
            @drop="onDrop($event)"
          >
            <h3 class="section-title">
              <i class="pi pi-map"></i> 
              Itinerarul tău
              <Badge :value="itinerary.items.length" />
            </h3>
            <div class="empty-state" v-if="itinerary.items.length === 0">
              <i class="pi pi-map" style="font-size: 2rem"></i>
              <p>Trage și plasează obiective aici sau apasă pe ele pentru a le adăuga</p>
            </div>
            <ScrollPanel class="custom-scrollpanel" v-else>
              <div class="itinerary-items">
                <div
                  v-for="(item, index) in itinerary.items"
                  :key="index"
                  class="itinerary-item"
                >
                  <div class="item-content">
                    <span class="order-number">{{ index + 1 }}</span>
                    <img
                      :src="getItemImage(item)"
                      :alt="item?.name"
                      class="item-image"
                    />
                    <div class="item-info">
                      <h4>{{ item?.name }}</h4>
                      <p><i class="pi pi-map-marker"></i> {{ item?.city }}</p>
                    </div>
                  </div>
                  <div class="item-actions">
                    <Button
                      v-if="index > 0"
                      icon="pi pi-arrow-up"
                      class="p-button-rounded p-button-secondary p-button-text"
                      @click="moveItemUp(index)"
                    />
                    <Button
                      v-if="index < itinerary.items.length - 1"
                      icon="pi pi-arrow-down"
                      class="p-button-rounded p-button-secondary p-button-text"
                      @click="moveItemDown(index)"
                    />
                    <Button
                      icon="pi pi-times"
                      class="p-button-rounded p-button-danger p-button-text"
                      @click="removeItem(index)"
                    />
                  </div>
                </div>
              </div>
            </ScrollPanel>
          </div>
        </div>
      </div>

      <!-- Pasul 3: Programare -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">Programează vizitele</h2>
        <div class="schedule-container">
          <div v-if="itinerary.items.length === 0" class="empty-state">
            <i class="pi pi-calendar" style="font-size: 2rem"></i>
            <p>Nu ai adăugat niciun obiectiv în itinerariul tău</p>
            <Button label="Înapoi la selectare" icon="pi pi-arrow-left" @click="currentStep = 1" />
          </div>
          <div
            v-for="(item, index) in itinerary.items"
            :key="index"
            class="schedule-item p-card"
          >
            <div class="item-header">
              <span class="order-badge">{{ index + 1 }}</span>
              <div class="item-basic-info">
                <h3>{{ item.name }}</h3>
                <p><i class="pi pi-map-marker"></i> {{ item.city }}</p>
              </div>
            </div>
            <div class="time-selection">
              <div class="date-time-picker">
                <label>Data și ora vizitei</label>
                <Calendar
                  v-model="item.visitDate"
                  :showTime="true"
                  :showSeconds="false"
                  :minDate="startDate || undefined"
                  :maxDate="endDate || undefined"
                  class="w-full"
                  placeholder="Selectează data și ora"
                />
              </div>
              <div class="duration-input">
                <label>Timp estimat de vizită (ore)</label>
                <InputNumber
                  v-model="item.duration"
                  :min="0.5"
                  :max="24"
                  :step="0.5"
                  showButtons
                />
              </div>
              <div class="notes-input">
                <label>Note personale</label>
                <Textarea 
                  v-model="item.notes" 
                  rows="2" 
                  placeholder="Adaugă orice notițe importante despre această vizită..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pasul 4: Confirmare -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">Confirmă itinerariul</h2>
        <div class="summary-container p-card">
          <div class="summary-header">
            <h3>{{ itinerary.name }}</h3>
            <p v-if="startDate && endDate">
              <i class="pi pi-calendar"></i> 
              {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
            </p>
            <p class="description">{{ itinerary.description }}</p>
          </div>
          
          <div class="summary-items">
            <h4><i class="pi pi-list"></i> Obiective și evenimente ({{ itinerary.items.length }})</h4>
            <div class="timeline">
              <div 
                v-for="(item, index) in itinerary.items" 
                :key="index"
                class="timeline-item"
              >
                <div class="timeline-marker">{{ index + 1 }}</div>
                <div class="timeline-content p-card">
                  <div class="content-header">
                    <h5>{{ item.name }}</h5>
                    <span class="badge" :class="item.type === 'objective' ? 'objective-badge' : 'event-badge'">
                      {{ item.type === 'objective' ? 'Obiectiv' : 'Eveniment' }}
                    </span>
                  </div>
                  <div class="content-details">
                    <p><i class="pi pi-map-marker"></i> {{ item.city }}</p>
                    <p v-if="item.visitDate"><i class="pi pi-calendar"></i> {{ formatDateTime(item.visitDate) }}</p>
                    <p v-if="item.duration"><i class="pi pi-clock"></i> {{ item.duration }} ore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wizard-actions">
      <Button
        v-if="currentStep > 0"
        label="Înapoi"
        icon="pi pi-arrow-left"
        class="p-button-secondary"
        @click="previousStep"
      />
      <div class="right-actions">
        <Button
          v-if="currentStep < steps.length - 1"
          label="Următorul"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="p-button-primary"
          @click="nextStep"
        />
        <Button
          v-if="currentStep === steps.length - 1"
          label="Salvează itinerarul"
          icon="pi pi-check"
          iconPos="right"
          class="p-button-success"
          @click="saveItinerary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from "vue";
import { useObjectivesStore } from "../../stores/objectivesStore";
import { useEventsStore } from "../../stores/eventStore";
import { useItineraryStore } from "../../stores/itineraryStore";
import { IItinerary, IItineraryDetail } from "../../Interfaces";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "primevue/usetoast";

interface ItineraryItem {
  id: number;
  name: string;
  city: string;
  images?: string[];
  visitDate: Date | undefined;
  duration: number;
  notes?: string;
  type: "objective" | "event";
}

interface Itinerary {
  name: string;
  description: string;
  items: ItineraryItem[];
}

const objectivesStore = useObjectivesStore();
const eventsStore = useEventsStore();
const itineraryStore = useItineraryStore();
const userStore = useUserStore();
const toast = useToast();

const currentStep = ref(0);
const searchQuery = ref("");
const startDate = ref<Date | undefined>(undefined);
const endDate = ref<Date | undefined>(undefined);
const showValidation = ref(false);
const itemTypeFilter = ref("toate");

const itinerary = ref<Itinerary>({
  name: "",
  description: "",
  items: [],
});

const steps = [
  { label: "Informații de bază" },
  { label: "Selectare obiective" },
  { label: "Programare" },
  { label: "Confirmare" }
];

const filterOptions = [
  { label: "Toate", value: "toate" },
  { label: "Obiective", value: "obiective" },
  { label: "Evenimente", value: "evenimente" }
];

onBeforeMount(async () => {
  try {
    await objectivesStore.getObjectives();
    await eventsStore.getEvents();
  } catch (error) {
    console.error("Eroare la încărcarea datelor:", error);
    toast.add({
      severity: "error",
      summary: "Eroare",
      detail: "Nu am putut încărca datele. Vă rugăm să încercați din nou.",
      life: 5000
    });
  }
});

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase();
  const objectives = objectivesStore.objectives;
  const events = eventsStore.events;
  
  let allItems = [];
  
  // Filtrare după tip (obiective sau evenimente)
  if (itemTypeFilter.value === "obiective") {
    allItems = [...objectives];
  } else if (itemTypeFilter.value === "evenimente") {
    allItems = [...events];
  } else {
    allItems = [...objectives, ...events];
  }

  // Nu includem obiective care sunt deja în itinerariu
  const existingIds = itinerary.value.items.map(item => item.id);
  allItems = allItems.filter(item => !existingIds.includes(item.id));

  // Filtrare după query (căutare)
  if (!query || query.trim() === "") {
    return allItems;
  }

  return allItems.filter(
    (item) =>
      item.name?.toLowerCase().includes(query) ||
      item.city?.toLowerCase().includes(query)
  );
});

const getItemImage = (item: any) => {
  if (item.images && item.images.length > 0) {
    return item.images[0];
  }
  return item.type === "objective" ? "/images/placeholder-objective.jpg" : "/images/placeholder-event.jpg";
};

const getItemType = (item: any): "objective" | "event" => {
  // Verificăm dacă este un obiectiv sau un eveniment pe baza structurii
  if (item.type !== undefined && item.latitude !== undefined) {
    return "objective";
  }
  return "event";
};

const onDragStart = (event: DragEvent, item: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  }
};

const onDrop = (event: DragEvent) => {
  const itemData = event.dataTransfer?.getData("text/plain");
  if (itemData) {
    const item = JSON.parse(itemData);
    addItemToItinerary(item);
  }
};

const addItemToItinerary = (item: any) => {
  // Verificăm dacă obiectivul/evenimentul este deja în itinerariu
  const isAlreadyAdded = itinerary.value.items.some(i => i.id === item.id);
  
  if (isAlreadyAdded) {
    toast.add({
      severity: "info",
      summary: "Info",
      detail: "Acest element este deja adăugat în itinerariu",
      life: 3000
    });
    return;
  }

  const itineraryItem: ItineraryItem = {
    id: item.id,
    name: item.name,
    city: item.city,
    images: item.images,
    visitDate: startDate.value,
    duration: 1,
    notes: "",
    type: getItemType(item),
  };
  
  itinerary.value.items.push(itineraryItem);
  
  toast.add({
    severity: "success",
    summary: "Element adăugat",
    detail: `${item.name} a fost adăugat în itinerariu`,
    life: 2000
  });
};

const removeItem = (index: number) => {
  const removedItem = itinerary.value.items[index];
  itinerary.value.items.splice(index, 1);
  
  toast.add({
    severity: "info",
    summary: "Element eliminat",
    detail: `${removedItem.name} a fost eliminat din itinerariu`,
    life: 2000
  });
};

const moveItemUp = (index: number) => {
  if (index > 0) {
    const temp = itinerary.value.items[index];
    itinerary.value.items[index] = itinerary.value.items[index - 1];
    itinerary.value.items[index - 1] = temp;
  }
};

const moveItemDown = (index: number) => {
  if (index < itinerary.value.items.length - 1) {
    const temp = itinerary.value.items[index];
    itinerary.value.items[index] = itinerary.value.items[index + 1];
    itinerary.value.items[index + 1] = temp;
  }
};

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  return date.toLocaleDateString('ro-RO', options);
};

const formatDateTime = (date: Date | undefined) => {
  if (!date) return "";
  
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('ro-RO', options);
};

const validateCurrentStep = () => {
  if (currentStep.value === 0) {
    if (!itinerary.value.name) {
      showValidation.value = true;
      toast.add({
        severity: "error",
        summary: "Validare",
        detail: "Vă rugăm să completați numele itinerariului",
        life: 3000
      });
      return false;
    }
    if (!startDate.value || !endDate.value) {
      toast.add({
        severity: "error",
        summary: "Validare",
        detail: "Vă rugăm să selectați perioada de călătorie",
        life: 3000
      });
      return false;
    }
  } else if (currentStep.value === 1) {
    if (itinerary.value.items.length === 0) {
      toast.add({
        severity: "error",
        summary: "Validare",
        detail: "Vă rugăm să adăugați cel puțin un obiectiv sau eveniment",
        life: 3000
      });
      return false;
    }
  }
  return true;
};

const nextStep = () => {
  if (!validateCurrentStep()) return;
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const emit = defineEmits(["itinerary-created"]);

const saveItinerary = async () => {
  try {
    // Transformăm datele în formatul corect pentru API
    const itineraryData: IItinerary = {
      id: 0,
      name: itinerary.value.name,
      description: itinerary.value.description,
      idUser: userStore.userData.id,
      startDate: startDate.value || new Date(),
      endDate: endDate.value || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      itineraryDetails: itinerary.value.items.map((item, index) => {
        const objective = objectivesStore.objectives.find(
          (o) => o.id === item.id
        );
        const event = eventsStore.events.find((e) => e.id === item.id);

        return {
          id: 0,
          name: item.name,
          descriere:
            item.type === "objective"
              ? objective?.description || ""
              : event?.description || "",
          visitOrder: index + 1,
          idObjective: item.type === "objective" ? item.id : undefined,
          idEvent: item.type === "event" ? item.id : undefined,
          idItinerary: 0,
          visitDate: item.visitDate,
          duration: item.duration,
          notes: item.notes
        } as IItineraryDetail;
      }),
    };

    itineraryStore.selectedItinerary = itineraryData;
    await itineraryStore.addItinerary();
    
    toast.add({
      severity: "success",
      summary: "Succes",
      detail: "Itinerariul a fost salvat cu succes!",
      life: 5000
    });
    
    emit("itinerary-created");
  } catch (error) {
    console.error("Eroare la salvarea itinerariului:", error);
    toast.add({
      severity: "error",
      summary: "Eroare",
      detail: "A apărut o eroare la salvarea itinerariului. Vă rugăm să încercați din nou.",
      life: 5000
    });
  }
};

// Resetăm validarea când se modifică numele
watch(() => itinerary.value.name, () => {
  if (itinerary.value.name && showValidation.value) {
    showValidation.value = false;
  }
});
</script>

<style scoped>
.create-itinerary-wizard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.wizard-header {
  margin-bottom: 2rem;
  text-align: center;
}

.wizard-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color, #3B82F6);
}

.wizard-content {
  margin: 2rem 0;
  min-height: 450px;
}

.step-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color-secondary, #64748B);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-content {
  background: var(--surface-ground, #f8f9fa);
  padding: 1.5rem;
  border-radius: 12px;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #334155);
}

.date-range-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.search-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex-grow: 1;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.selection-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
  color: var(--text-color, #334155);
}

.section-title i {
  color: var(--primary-color, #3B82F6);
}

.available-items,
.current-itinerary {
  padding: 1.5rem;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-top: 0.5rem;
  flex-grow: 1;
}

.item-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  color: white;
  z-index: 1;
}

.objective-badge {
  background-color: var(--primary-color, #3B82F6);
}

.event-badge {
  background-color: var(--orange-500, #f97316);
}

.item-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.item-info {
  padding: 0.75rem;
}

.item-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-color, #334155);
}

.item-info p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-color-secondary, #64748B);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: var(--text-color-secondary, #64748B);
  gap: 1rem;
}

.itinerary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-top: 0.5rem;
  flex-grow: 1;
}

.itinerary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.itinerary-item:hover {
  transform: translateX(3px);
  background-color: var(--surface-hover, #f8fafc);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-content .item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.order-number {
  background: var(--primary-color, #3B82F6);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.item-actions {
  display: flex;
  gap: 0.25rem;
}

.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.schedule-item {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.order-badge {
  background: var(--primary-color, #3B82F6);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
}

.item-basic-info h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-color, #334155);
}

.item-basic-info p {
  margin: 0;
  color: var(--text-color-secondary, #64748B);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.time-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.time-selection label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #334155);
}

.notes-input {
  grid-column: 1 / span 2;
}

.summary-container {
  padding: 2rem;
}

.summary-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--surface-border, #e5e7eb);
}

.summary-header h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-color, #334155);
}

.summary-header p {
  margin: 0 0 0.5rem 0;
  color: var(--text-color-secondary, #64748B);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-header .description {
  margin-top: 1rem;
  color: var(--text-color, #334155);
}

.summary-items h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color, #334155);
  margin-bottom: 1.5rem;
}

.timeline {
  padding-left: 1.5rem;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--primary-color, #3B82F6);
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  transform: translateX(-50%);
  background-color: var(--primary-color, #3B82F6);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.timeline-content {
  padding: 1rem;
  margin-left: 1rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.content-header h5 {
  margin: 0;
  color: var(--text-color, #334155);
}

.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  color: white;
}

.content-details p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--text-color-secondary, #64748B);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wizard-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.right-actions {
  display: flex;
  gap: 1rem;
}

.custom-scrollpanel {
  width: 100%;
  height: 100%;
}

.custom-scrollpanel .p-scrollpanel-content {
  padding: 0.5rem;
}

/* Eliminăm scrollbarul personalizat deoarece acum folosim ScrollPanel */
::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .selection-container {
    grid-template-columns: 1fr;
  }

  .time-selection {
    grid-template-columns: 1fr;
  }

  .notes-input {
    grid-column: auto;
  }

  .date-range-picker {
    grid-template-columns: 1fr;
  }
}
</style>
