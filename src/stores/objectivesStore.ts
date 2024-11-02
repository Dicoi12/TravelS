import { defineStore } from "pinia";
import { IObjective, IServiceResult } from "../Interfaces";
import fetchApi from "../stores/fetch";
export const useObjectivesStore = defineStore("objectivesStore", {
  state: (): {
    selectedObjective: IObjective;
    objectives: IObjective[];
    favourites: IObjective[];
  } => {
    return {
      selectedObjective: {
        id: 0,
        name: "",
        city: "",
        description: null,
        latitude: 0,
        longitude: 0,
        images: [],
      },
      objectives: [],
      favourites: [],
    };
  },
  actions: {
    async addObjective() {
      try {
        const data = await fetchApi(
          "Objectives/PostObjective",
          "POST",
          this.selectedObjective
        );
        console.log("Added objective:", data);
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },
    async getImage() {
      try {
        const data = await fetchApi("ObjectiveImage/getimage/1", "get");
        console.log("Added objective:", data);
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },
    async getObjectives() {
      try {
        const data = await fetchApi("Objectives/GetObjectivesAsync", "get");
        let response = data as IServiceResult;
        this.objectives = response.result;
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },
    async getLocalObjectives(latitude: number, longitude: number) {
      try {
        const payload = {
          latitude: latitude,
          longitude: longitude,
        };
        const data = await fetchApi(
          "Objectives/GetLocalObjectives",
          "get",
          undefined,
          payload
        );
        let response = data as IServiceResult;
        this.objectives = response.result;
      } catch (error) {
        console.error("Error fetch objective:", error);
      }
    },
    async updateObjective(model: IObjective) {
      try {
        const data = await fetchApi(
          "Objectives/UpdateObjective",
          "put",
          undefined,
          model
        );
        let response = data as IServiceResult;
        return response.result;
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },
    async deleteObjective(id: number) {
      try {
        const data = await fetchApi(`Objectives/${id}`, "delete");
        let response = data as IServiceResult;
        return response.result;
      } catch (error) {
        console.error("Error deleting objective:", error);
      }
    },
  },
  getters: {},
  persist: true,
});
