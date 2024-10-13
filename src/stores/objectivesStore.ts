import { defineStore } from "pinia";
import { IObjective, IServiceResult } from "../Interfaces";
import fetchApi from "../stores/fetch";
export const useObjectivesStore = defineStore("objectivesStore", {
  state: (): {
    selectedObjective: IObjective;
    objectives: IObjective[];
  } => {
    return {
      selectedObjective: {
        id: 0,
        name: "",
        description: null,
        latitude: 0,
        longitude: 0,
        images:[]
      },
      objectives: [],
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
       let response=data as IServiceResult;
       this.objectives=response.result;
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },
  },
  getters: {},
  persist: true,
});
