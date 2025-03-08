import { defineStore } from "pinia";
import { IServiceResult, IObjectiveType } from "../Interfaces";
import fetchApi from "../stores/fetch";

export const useObjectiveTypeStore = defineStore("objectiveTypeStore", {
  state: (): {
    selectedObjectiveType: IObjectiveType;
    objectiveTypes: IObjectiveType[];
    search:string
  } => {
    return {
      selectedObjectiveType: {
        id: 0,
        name: "",
        description: "",
      },
      objectiveTypes: [],
      search:""
    };
  },
  actions: {
    async addObjectiveType() {
      try {
        const data = await fetchApi(
          "ObjectiveType?name=" + this.selectedObjectiveType.name + "&description=" + this.selectedObjectiveType.description,
          "POST",
        );
        console.log("Added objective type:", data);
      } catch (error) {
        console.error("Error adding objective type:", error);
      }
    },
    async getObjectiveTypes() {
      try {
        const data = await fetchApi("ObjectiveType", "get");
        let response = data;
        this.objectiveTypes = data
      } catch (error) {
        console.error("Error fetching objective types:", error);
        this.objectiveTypes = [];
      }
    },
    async updateObjectiveType(id: number) {
      try {
        const data = await fetchApi(
          "ObjectiveType/" + id + "?name=" + this.selectedObjectiveType.name + "&description=" + this.selectedObjectiveType.description,
          "PUT",
          this.selectedObjectiveType
        );
        console.log("Updated objective type:", data);
      } catch (error) {
        console.error("Error updating objective type:", error);
      }
    },
    async deleteObjectiveType(id: number) {
      try {
        await fetchApi(`ObjectiveType/${id}`, "DELETE");
        this.getObjectiveTypes();
      } catch (error) {
        console.error("Error deleting objective type:", error);
      }
    },
    async getById(id: number) {
      try {
        const data = await fetchApi(`ObjectiveType/${id}`, "get");
        let response = data as IServiceResult;
        this.selectedObjectiveType = response.result;
        return response.result;
      } catch (error) {
        console.error("Error fetching objective type by id:", error);
        return null;
      }
    },
    resetSelectedObjectiveType() {
      this.selectedObjectiveType = {
        id: 0,
        name: "",
        description: "",
      };
    },
  },
  persist: true,
});
