import { IItinerary, IItineraryStore } from "@/Interfaces";
import { defineStore } from "pinia";
import fetchApi from "./fetch";
export const useItineraryStore = defineStore("itineraryStore", {
  state: (): IItineraryStore => {
    return {
    itineraries:[],
    selectedItinerary:{
        name:'',
        description:'',
        idObjectives:[],
        idEvents:[]
    }
    };
  },
  actions: {
     async addItinerary(model?:IItinerary){
        try {
            const data = await fetchApi(
              "Itinerary/AddItinerary",
              "POST",
              this.selectedItinerary
            );
            console.log("Added objective:", data);
          } catch (error) {
            console.error("Error adding objective:", error);
          }
     },
     resetItinerary(){
        this.selectedItinerary={
            name:'',
            description:'',
            idObjectives:[],
            idEvents:[]
        }
     }
  },
  getters: {},
  persist: true,
});
