import { defineStore } from "pinia";
import fetchApi from "../stores/fetch";
import { IEvent, IServiceResult } from "../Interfaces";

export const useEventsStore = defineStore("eventsStore", {
  state: (): {
    events: IEvent[];
    selectedEvent: IEvent;
    search: string;
  } => ({
    events: [],
    selectedEvent: {
      id: 0,
      name: "",
      description: "",
      city: "",
      latitude: 0,
      longitude: 0,
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      country: "",
    },
    search: "",
  }),
  actions: {
    async getEvents() {
      try {
        console.log('Se încarcă evenimentele...')
        const response = await fetchApi(`Event/GetAllEventsAsync`, "get");
        console.log('Răspuns API evenimente:', response)
        const result = response as IServiceResult;
    
        if (result) {
          this.events = result.result;
          console.log('Evenimente setate în store:', this.events)
        } 
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    
    async fetchEventById(id: number) {
      try {
        const response = await fetchApi(`Event/${id}`, "get");
        const result = response as IServiceResult;
        this.selectedEvent = result.result;
      } catch (error) {
        console.error("Error fetching event by ID:", error);
      }
    },
    async fetchEventsByCityOrCoords(city?: string, lat?: number, lon?: number) {
      try {
        const queryParams = new URLSearchParams({
          ...(city && { city }),
          ...(lat && { lat: lat.toString() }),
          ...(lon && { lon: lon.toString() }),
        }).toString();

        const response = await fetchApi(`Event?${queryParams}`, "get");
        const result = response as IServiceResult;
        this.events = result.result;
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },
    async addEvent(event: IEvent) {
      try {
        const response = await fetchApi(`Event`, "post", event);
        const result = response as IServiceResult;
        this.events.push(result.result);
      } catch (error) {
        console.error("Error adding event:", error);
      }
    },
    async updateEvent(event: IEvent) {
      try {
        const response = await fetchApi(`Event/${event.id}`, "put", event);
        const result = response as IServiceResult;
        const index = this.events.findIndex((e:any) => e.id === event.id);
        if (index !== -1) {
          this.events[index] = result.result;
        }
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    async deleteEvent(id: number) {
      try {
        const response = await fetchApi(`Event/${id}`, "delete");
        const result = response as IServiceResult;
        if (result.result) {
          this.events = this.events.filter((e:any) => e.id !== id);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },
    resetSelectedEvent() {
      this.selectedEvent = {
        id: 0,
        name: "",
        description: "",
        city: "",
        latitude: 0,
        longitude: 0,
        startDate: new Date(),
        endDate: new Date(),
        images: [],
        country: "România",
      };
    },
  },
  persist: true,
});
