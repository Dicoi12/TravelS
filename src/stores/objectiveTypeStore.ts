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
          "ObjectiveTypes/PostObjectiveType",
          "POST",
          this.selectedObjectiveType
        );
        console.log("Added objective type:", data);
      } catch (error) {
        console.error("Error adding objective type:", error);
      }
    },
    async getObjectiveTypes() {
      try {
        const data = await fetchApi("ObjectiveTypes/GetObjectiveTypesAsync", "get");
        let response = data as IServiceResult;
        this.objectiveTypes = response.result;
      } catch (error) {
        console.error("Error fetching objective types:", error);
        this.objectiveTypes = [];
      }
    },
    async updateObjectiveType() {
      try {
        const data = await fetchApi(
          "ObjectiveTypes/UpdateObjectiveType",
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
        await fetchApi(`ObjectiveTypes/${id}`, "DELETE");
        this.getObjectiveTypes();
      } catch (error) {
        console.error("Error deleting objective type:", error);
      }
    },
    async getById(id: number) {
      try {
        const data = await fetchApi(`ObjectiveTypes/${id}`, "get");
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
