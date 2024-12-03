import { defineStore } from "pinia";
export const useHelperStore = defineStore("helperStore", {
  state: (): {
    
  } => {
    return {
    
    };
  },
  actions: {
     formatDate  (date: Date | null | undefined): string  {
        if (!date) return '';
        
        const pad = (n: number): string => n.toString().padStart(2, '0');
        
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        
        return `${day}.${month}.${year} ${hours}:${minutes}`;
      }
  },
  getters: {},
  persist: true,
});
