import { defineStore } from "pinia";
import { IItineraryDetail, IServiceResult } from "../Interfaces";
import fetchApi from "../stores/fetch";

export const useItineraryDetailStore = defineStore("itineraryDetailStore", {
  state: (): {
    selectedItineraryDetail: IItineraryDetail | null;
    itineraryDetails: IItineraryDetail[];
  } => {
    return {
      selectedItineraryDetail: null,
      itineraryDetails: []
    };
  },

  actions: {
    async addItineraryDetail(itineraryDetailDto: IItineraryDetail) {
      try {
        const data = await fetchApi(
          "ItineraryDetail/AddItineraryDetailAsync",
          "post",
          itineraryDetailDto
        );
        
        const response = data as IServiceResult;
        await this.getAllItineraryDetails();
        return response;
      } catch (error) {
        console.error("Error adding itinerary detail:", error);
        throw error;
      }
    },

    async updateItineraryDetail(itineraryDetailDto: IItineraryDetail) {
      try {
        const data = await fetchApi(
          "ItineraryDetail/UpdateItineraryDetailAsync",
          "put",
          itineraryDetailDto
        );
        
        const response = data as IServiceResult;
        await this.getAllItineraryDetails();
        return response;
      } catch (error) {
        console.error("Error updating itinerary detail:", error);
        throw error;
      }
    },

    async deleteItineraryDetail(id: number) {
      try {
        const data = await fetchApi(`ItineraryDetail/${id}`, "delete");
        const response = data as IServiceResult;
        await this.getAllItineraryDetails();
        return response;
      } catch (error) {
        console.error("Error deleting itinerary detail:", error);
        throw error;
      }
    },

    async getItineraryDetailById(id: number) {
      try {
        const data = await fetchApi(`ItineraryDetail/${id}`, "get");
        const response = data as IServiceResult;
        this.selectedItineraryDetail = response.result;
        return response;
      } catch (error) {
        console.error("Error fetching itinerary detail by id:", error);
        throw error;
      }
    },

    async getAllItineraryDetails() {
      try {
        const data = await fetchApi(
          "ItineraryDetail/GetAllItineraryDetailsAsync",
          "get"
        );
        const response = data as IServiceResult;
        this.itineraryDetails = response.result;
        return response;
      } catch (error) {
        console.error("Error fetching all itinerary details:", error);
        this.itineraryDetails = [];
        throw error;
      }
    },

    resetSelectedItineraryDetail() {
      this.selectedItineraryDetail = null;
    }
  },

  getters: {
    getItineraryDetailsByItineraryId: (state) => (itineraryId: number) => {
      return state.itineraryDetails.filter(detail => detail.idItinerary === itineraryId);
    }
  },

  persist: true,
});
