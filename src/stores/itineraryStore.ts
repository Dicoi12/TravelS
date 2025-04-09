import { defineStore } from "pinia";
import { IItinerary, IServiceResult, ItineraryFilterModel } from "../Interfaces";
import fetchApi from "../stores/fetch";

export const useItineraryStore = defineStore("itineraryStore", {
  state: (): {
    selectedItinerary: IItinerary;
    itineraries: IItinerary[];
    search: string;
    filter: ItineraryFilterModel;
  } => {
    return {
      selectedItinerary: {
        id: 0,
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        itineraryDetails: []
      },
      itineraries: [],
      search: "",
      filter: {
        latitude: null,
        longitude: null,
        maxDistance: null,
        name: "",
        startDate: null,
        endDate: null,
        minRating: null,
      }
    };
  },

  actions: {
    async addOrUpdateItinerary() {
      try {
        const data = await fetchApi(
          "Itinerary/AddOrUpdateItineraryAsync",
          "post",
          null,
          this.selectedItinerary  
        );
        console.log("Added itinerary:", data);
      } catch (error) {
        console.error("Error adding itinerary:", error);
      }
    },

    async getItineraries() {
      try {
        const data = await fetchApi(
          `Itinerary/GetItineraryAsync`,
          "get"
        );
        let response = data as IServiceResult;
        this.itineraries = response.result;
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        this.itineraries = []; 
      }
    },

    async getLocalItineraries() {
      try {
        const data = await fetchApi(
          "Itinerary/GetLocalItineraries",
          "post",
          this.filter
        );
        let response = data as IServiceResult;
        this.itineraries = response.result;
      } catch (error) {
        console.error("Error fetch itineraries:", error);
        this.itineraries = [];
      }
    },

    async updateItinerary() {
      try {
        const data = await fetchApi(
          "Itinerary/UpdateItinerary",
          "put",
          undefined,
          this.selectedItinerary
        );
        let response = data as IServiceResult;
        return response.result;
      } catch (error) {
        console.error("Error updating itinerary:", error);
      }
    },

    async deleteItinerary(id?: number) {
      try {
        const data = await fetchApi(`Itinerary/${id}`, "delete");
        let response = data as IServiceResult;
        this.getItineraries();
        return response.result;
      } catch (error) {
        console.error("Error deleting itinerary:", error);
      }
    },

    async uploadFile(file: File, itineraryId: number) {
      const formData = new FormData();
      formData.append("imageFile", file);
      formData.append("itineraryId", String(itineraryId));

      try {
        const response = await fetchApi(
          "ItineraryImage/UploadImage",
          "POST",
          formData,
          undefined,
          true
        );
        console.log("File uploaded successfully:", response);
        return response;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    },

    resetSelectedItinerary() {
      this.selectedItinerary = {
        id: 0,
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        itineraryDetails: []
      };
    },

    resetFilterData() {
      this.filter = {
        latitude: null,
        longitude: null,
        maxDistance: null,
        name: "",
        startDate: null,
        endDate: null,
        minRating: null,
      };
    },

    async getById(id: number) {
      try { 
        const data = await fetchApi(`Itinerary/${id}`, "get");
        let response = data as IServiceResult;
        this.selectedItinerary = response.result;
        return response.result;
      } catch (error) {
        console.error("Error fetching itinerary by id:", error);
        return null;
      }
    },
  },

  getters: {},
  persist: true,
});