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
        dataStart: new Date(),
        dataStop: new Date(),
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
    async addItinerary() {
      try {
        const itineraryDto = {
          ...this.selectedItinerary,
          dataStart: this.selectedItinerary.dataStart?.toISOString(),
          dataStop: this.selectedItinerary.dataStop?.toISOString(),
          itineraryDetails: this.selectedItinerary.itineraryDetails.map(detail => ({
            name: detail.name,
            descriere: detail.descriere,
            idItinerary: this.selectedItinerary.id,
            visitOrder: detail.visitOrder,
            idObjective: detail.idObjective || null,
            idEvent: detail.idEvent || null,
            date: detail.date ? new Date(detail.date).toISOString() : null,
            estimatedTime: detail.estimatedTime || null,
          }))
        };

        const data = await fetchApi(
          "itinerary/AddItineraryAsync",
          "POST",
          itineraryDto
        );

        const response = data as IServiceResult;
        if (response.isSuccessful) {
          await this.getItineraries();
          this.selectedItinerary = response.result as IItinerary;
        }
        return response;
      } catch (error) {
        console.error("Error adding itinerary:", error);
        throw error;
      }
    },

    async updateItinerary() {
      try {
        const itineraryDto = {
          ...this.selectedItinerary,
          dataStart: this.selectedItinerary.dataStart?.toISOString(),
          dataStop: this.selectedItinerary.dataStop?.toISOString()
        };

        const data = await fetchApi(
          "itinerary/UpdateItineraryAsync",
          "PUT",
          itineraryDto
        );

        const response = data as IServiceResult;
        if (response.isSuccessful) {
          await this.getItineraries();
        }
        return response;
      } catch (error) {
        console.error("Error updating itinerary:", error);
        throw error;
      }
    },

    async addOrUpdateItinerary() {
      if (this.selectedItinerary.id) {
        return await this.updateItinerary();
      } else {
        return await this.addItinerary();
      }
    },

    async getItineraries() {
      try {
        const data = await fetchApi("itinerary/GetItineraryAsync", "GET");
        const response = data as IServiceResult;
        this.itineraries = response.result;
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        this.itineraries = [];
      }
    },

    async getMyItineraries() {
      try {
        const data = await fetchApi("itinerary/me", "GET");
        const response = data as IServiceResult;
        this.itineraries = response.result;
      } catch (error) {
        console.error("Error fetching user itineraries:", error);
        this.itineraries = [];
      }
    },

    async getItineraryById(id: string) {
      try {
        const data = await fetchApi(`itinerary/${id}`, "GET");
        const response = data as IServiceResult;
        this.selectedItinerary = response.result;
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    },

    async deleteItinerary(id: number) {
      try {
        const data = await fetchApi(`itinerary/${id}`, "DELETE");
        const response = data as IServiceResult;
        await this.getItineraries();
        return response;
      } catch (error) {
        console.error("Error deleting itinerary:", error);
        throw error;
      }
    },

    resetSelectedItinerary() {
      this.selectedItinerary = {
        id: 0,
        name: "",
        description: "",
        dataStart: new Date(),
        dataStop: new Date(),
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
        const data = await fetchApi(`itinerary/${id}`, "GET");
        const response = data as IServiceResult;
        this.selectedItinerary = response.result;
        return response;
      } catch (error) {
        console.error("Error fetching itinerary by id:", error);
        throw error;
      }
    },
  },

  getters: {},
  persist: true,
});
