import { defineStore } from "pinia";
import fetchApi from "../stores/fetch";
import { IExperience, IServiceResult } from "../Interfaces";

export const useExperienceStore = defineStore("experienceStore", {
  state: (): {
    experiences: IExperience[];
    selectedExperience: IExperience;
  } => ({
    experiences: [],
    selectedExperience: {
      id: 0,
      title: "",
      description: "",
      location: "",
      date: new Date(),
      images: [],
    },
  }),
  actions: {
    async getAllExperiences() {
      try {
        const response = await fetchApi(`Experience`, "get");
        const result = response as IServiceResult;

        if (result) {
          this.experiences = result.result;
          console.log(this.experiences);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    },

    async getExperienceById(id: number) {
      try {
        const response = await fetchApi(`Experience/${id}`, "get");
        const result = response as IServiceResult;
        this.selectedExperience = result.result;
      } catch (error) {
        console.error("Error fetching experience by ID:", error);
      }
    },

    async addExperience(experience: IExperience) {
      try {
        const response = await fetchApi(`Experience`, "post", experience);
        const result = response as IServiceResult;
        this.experiences.push(result.result);
      } catch (error) {
        console.error("Error adding experience:", error);
      }
    },

    async updateExperience(experience: IExperience) {
      try {
        const response = await fetchApi(`Experience/${experience.id}`, "put", experience);
        const result = response as IServiceResult;
        const index = this.experiences.findIndex((e: any) => e.id === experience.id);
        if (index !== -1) {
          this.experiences[index] = result.result;
        }
      } catch (error) {
        console.error("Error updating experience:", error);
      }
    },

    resetSelectedExperience() {
      this.selectedExperience = {
        id: 0,
        title: "",
        description: "",
        location: "",
        date: new Date(),
        images: [],
      };
    },
  },
  persist: true,
});
