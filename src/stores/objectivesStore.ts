import { defineStore } from "pinia";
import { IObjective, IObjectivesStore } from "../Interfaces";
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
  },
  getters: {},
  persist: true,
});
