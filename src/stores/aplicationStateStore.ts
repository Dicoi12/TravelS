import { defineStore } from "pinia";
export const useApplicationStore = defineStore("applicationStore", {
  state: (): {
        onMainPage:boolean
  } => {
    return {
        onMainPage:false
    };
  },
  actions: {
   
  },
  getters: {},
  persist: true,
});
