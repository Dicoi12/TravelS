import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { 
  IItineraryDTO, 
  IItineraryPageDTO, 
  IServiceResult 
} from '../Interfaces';
import fetchApi from '../stores/fetch';

export const useItineraryStore = defineStore('itinerary', () => {
  const itineraries = ref<IItineraryPageDTO[]>([]);
  const selectedItinerary = ref<IItineraryDTO>({
    name: '',
    description: '',
    objectivesIds: [],
    eventsIds: [],
    itineraryDetails: []
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const showDetailsDialog = ref(false);
  const selectedItineraryForDetails = ref<IItineraryDTO | null>(null);

  /**
   * Obține toate itinerariile
   */
  async function getAllItineraries() {
    try {
      loading.value = true;
      error.value = null;
      const response: IServiceResult = await fetchApi('Itinerary');
      if (response.isSuccesful) {
        itineraries.value = response.result;
      } else {
       console.log(response.validationMessage);
      }
    } catch (err) {
      error.value = 'Eroare la comunicarea cu serverul';
      console.error('Eroare la încărcarea itinerariilor:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Adaugă sau actualizează un itinerariu
   */
  async function addOrUpdateItinerary(itinerary: IItineraryDTO) {
    try {
      loading.value = true;
      error.value = null;
      const response: IServiceResult = await fetchApi('Itinerary', 'POST', itinerary);

      if (response.isSuccesful) {
        await getAllItineraries(); // Reîmprospătăm lista
        return response.result;
      } else {
        console.log(response.validationMessage);
      }
    } catch (err) {
      error.value = 'Eroare la comunicarea cu serverul';
      console.error('Eroare la salvarea itinerariului:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obține itinerariile unui utilizator specific
   */
  async function getItinerariesByUserId(userId: number) {
    try {
      loading.value = true;
      error.value = null;
      const response: IServiceResult = await fetchApi(`Itinerary/user/${userId}`);
      if (response.isSuccesful) {
        itineraries.value = response.result;
      } else {
        console.log(response.validationMessage);
      }
    } catch (err) {
      error.value = 'Eroare la comunicarea cu serverul';
      console.error('Eroare la încărcarea itin  erariilor utilizatorului:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Șterge un itinerariu pentru un utilizator specific
   */
  async function deleteItineraryByUser(itineraryId: number, userId: number) {
    try {
      loading.value = true;
      error.value = null;
      const response: IServiceResult = await fetchApi(`Itinerary/user/${itineraryId}`, 'DELETE', { userId });

      if (response.isSuccesful) {
        await getAllItineraries(); // Reîmprospătăm lista
        return true;
      } else {
        console.log(response.validationMessage);
        return false;
      }
    } catch (err) {
      error.value = 'Eroare la comunicarea cu serverul';
      console.error('Eroare la ștergerea itinerariului:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Resetează itinerariul selectat
   */
  function resetSelectedItinerary() {
    selectedItinerary.value = {
      name: '',
      description: '',
      objectivesIds: [],
      eventsIds: [],
      itineraryDetails: []
    };
  }

  /**
   * Setează itinerariul selectat
   */
  function setSelectedItinerary(itinerary: IItineraryPageDTO) {
    selectedItinerary.value = {
      id: itinerary.id,
      name: itinerary.name,
      description: itinerary.description,
      idUser: itinerary.idUser,
      itineraryDetails: [...itinerary.itineraryDetails],
      objectivesIds: itinerary.objectivesIds,
      eventsIds: itinerary.eventsIds
    };
  }

  return {
    // state
    itineraries,
    selectedItinerary,
    loading,
    error,

    // actions
    getAllItineraries,
    addOrUpdateItinerary,
    getItinerariesByUserId,
    deleteItineraryByUser,
    resetSelectedItinerary,
    setSelectedItinerary
  };
});
