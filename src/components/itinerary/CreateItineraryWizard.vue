<template>
  <div class="create-itinerary-wizard">
    <Steps :model="steps" :readonly="false" />
    
    <div class="wizard-content">
      <!-- Pasul 1: Informații de bază -->
      <div v-if="currentStep === 0" class="step-content">
        <h2>Informații de bază</h2>
        <div class="form-group">
          <label>Numele itinerarului</label>
          <InputText v-model="itinerary.name" class="w-full" />
        </div>
        <div class="form-group">
          <label>Descriere</label>
          <Textarea v-model="itinerary.description" rows="5" class="w-full" />
        </div>
      </div>

      <!-- Pasul 2: Selectare obiective -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>Selectează obiective și evenimente</h2>
        <div class="search-section">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText v-model="searchQuery" placeholder="Caută obiective sau evenimente..." class="w-full" />
          </span>
        </div>

        <div class="selection-container">
          <!-- Lista de obiective disponibile -->
          <div class="available-items">
            <h3>Obiective disponibile</h3>
            <div class="items-list">
              <div v-for="item in filteredItems" 
                   :key="item.id" 
                   class="item-card"
                   draggable="true"
                   @dragstart="onDragStart($event, item)">
                <img :src="getItemImage(item)" :alt="item.name" class="item-image" />
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.city }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Itinerarul curent -->
          <div class="current-itinerary"
               @dragover.prevent
               @drop="onDrop($event)">
            <h3>Itinerarul tău</h3>
            <div class="itinerary-items">
              <div v-for="(item, index) in itinerary.items" 
                   :key="index"
                   class="itinerary-item">
                <div class="item-content">
                  <span class="order-number">{{ index + 1 }}</span>
                  <img :src="getItemImage(item)" :alt="item?.name" class="item-image" />
                  <div class="item-info">
                    <h4>{{ item?.name }}</h4>
                    <p>{{ item?.city }}</p>
                  </div>
                </div>
                <Button icon="pi pi-times" 
                        class="p-button-rounded p-button-danger p-button-text" 
                        @click="removeItem(index)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pasul 3: Programare -->
      <div v-if="currentStep === 2" class="step-content">
        <h2>Programează vizitele</h2>
        <div class="schedule-container">
          <div v-for="(item, index) in itinerary.items" 
               :key="index"
               class="schedule-item">
            <div class="item-header">
              <h3>{{ item.name }}</h3>
              <span class="order-badge">{{ index + 1 }}</span>
            </div>
            <div class="time-selection">
              <Calendar v-model="item.visitDate" 
                       :showTime="true" 
                       :showSeconds="false"
                       :minDate="new Date()"
                       class="w-full" />
              <div class="duration-input">
                <label>Timp estimat de vizită (ore)</label>
                <InputNumber v-model="item.duration" 
                            :min="0.5" 
                            :max="24" 
                            :step="0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wizard-actions">
      <Button v-if="currentStep > 0" 
              label="Înapoi" 
              class="p-button-secondary" 
              @click="previousStep" />
      <Button v-if="currentStep < steps.length - 1" 
              label="Următorul" 
              class="p-button-primary" 
              @click="nextStep" />
      <Button v-if="currentStep === steps.length - 1" 
              label="Salvează itinerarul" 
              class="p-button-success" 
              @click="saveItinerary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectivesStore } from '../../stores/objectivesStore'
import { useEventsStore } from '../../stores/eventStore'
import { useItineraryStore } from '../../stores/itineraryStore'

interface ItineraryItem {
  id: number;
  name: string;
  city: string;
  images?: string[];
  visitDate: Date;
  duration: number;
}

interface Itinerary {
  name: string;
  description: string;
  items: ItineraryItem[];
}

const objectivesStore = useObjectivesStore()
const eventsStore = useEventsStore()
const itineraryStore = useItineraryStore()

const currentStep = ref(0)
const searchQuery = ref('')
const itinerary = ref<Itinerary>({
  name: '',
  description: '',
  items: []
})

const steps = [
  { label: 'Informații de bază' },
  { label: 'Selectare obiective' },
  { label: 'Programare' }
]

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase()
  const objectives = objectivesStore.objectives
  const events = eventsStore.events
  const allItems = [...objectives, ...events]
  
  return allItems.filter(item => 
    item.name?.toLowerCase().includes(query) ||
    item.city?.toLowerCase().includes(query)
  )
})

const getItemImage = (item: any) => {
  return item.images?.[0] || '/placeholder-image.jpg'
}

const onDragStart = (event: DragEvent, item: any) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(item))
  }
}

const onDrop = (event: DragEvent) => {
  const itemData = event.dataTransfer?.getData('text/plain')
  if (itemData) {
    const item = JSON.parse(itemData) as ItineraryItem
    itinerary.value.items.push({
      ...item,
      visitDate: new Date(),
      duration: 1
    })
  }
}

const removeItem = (index: number) => {
  itinerary.value.items.splice(index, 1)
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const emit = defineEmits(['itinerary-created'])

const saveItinerary = async () => {
  try {
    // @ts-ignore - Metoda va fi implementată în store
    await itineraryStore.createItinerary(itinerary.value)
    emit('itinerary-created')
  } catch (error) {
    console.error('Eroare la salvarea itinerarului:', error)
  }
}
</script>

<style scoped>
.create-itinerary-wizard {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.wizard-content {
  margin: 2rem 0;
  min-height: 400px;
}

.step-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.selection-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.available-items,
.current-itinerary {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.available-items h3,
.current-itinerary h3 {
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  flex-grow: 1;
}

.items-list::-webkit-scrollbar {
  width: 8px;
}

.items-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.items-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.item-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: move;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-2px);
}

.item-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.item-info {
  padding: 0.5rem;
}

.itinerary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  flex-grow: 1;
}

.itinerary-items::-webkit-scrollbar {
  width: 8px;
}

.itinerary-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.itinerary-items::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.itinerary-items::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.itinerary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.order-number {
  background: #42b983;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.schedule-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.time-selection {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.wizard-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .selection-container {
    grid-template-columns: 1fr;
  }

  .time-selection {
    grid-template-columns: 1fr;
  }
}
</style> 