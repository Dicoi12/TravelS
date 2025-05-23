import { defineStore } from "pinia";
import { IObjective, IServiceResult, ObjectiveFilterModel } from "../Interfaces";
import fetchApi from "../stores/fetch";
export interface RecommendedObjectiveDto {
  id: number;
  name: string;
  city: string;
  firstImageUrl: string | null;
  averageRating: number | null;
}
export const useObjectivesStore = defineStore("objectivesStore", {
  state: (): {
    selectedObjective: IObjective;
    objectives: IObjective[];
    favourites: IObjective[];
    search: string;
    filter: ObjectiveFilterModel;
    recommendedObjectives: RecommendedObjectiveDto[];
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
        distance: 0,
        duration: 0,
      },
      objectives: [],
      favourites: [],
      search: "",
      filter:{
        latitude: null,
        longitude: null,
        maxDistance: null,
        name: "",
        typeId: null,
        minRating: null,
      },
      recommendedObjectives: [],
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
        console.log('Se încarcă obiectivele...')
        const data = await fetchApi(`Objectives/GetObjectivesAsync?search=${this.search}`, "get");
        console.log('Răspuns API obiective:', data)
        let response = data as IServiceResult;
        this.objectives = response.result;
        console.log('Obiective setate în store:', this.objectives)
      } catch (error) {
        console.error("Error fetching objectives:", error);
        this.objectives = [
          {
            id: 1,
            name: "Castelul Bran",
            description:
              "Cunoscut și sub numele de Castelul lui Dracula, este situat în apropierea orașului Brașov.",
            latitude: 45.5155,
            longitude: 25.3674,
            city: "Bran",
            images: [],
          },
          {
            id: 2,
            name: "Biserica Neagră",
            description:
              "Un simbol al orașului Brașov, aceasta este una dintre cele mai importante biserici gotice din România.",
            latitude: 45.5935,
            longitude: 25.5854,
            city: "Brașov",
            images: [],
          },
          {
            id: 3,
            name: "Delta Dunării",
            description:
              "Un ecosistem unic în Europa, este o destinație populară pentru observarea păsărilor.",
            latitude: 45.1354,
            longitude: 29.5743,
            city: "Tulcea",
            images: [],
          },
          {
            id: 4,
            name: "Transfăgărășan",
            description:
              "Una dintre cele mai frumoase și spectaculoase drumuri din România, oferind priveliști uimitoare.",
            latitude: 45.5952,
            longitude: 24.6423,
            city: "Sebeș",
            images: [],
          },
          {
            id: 5,
            name: "Castelul Peleș",
            description:
              "Un castel magnific situat în Sinaia, considerat unul dintre cele mai frumoase din Europa.",
            latitude: 45.3535,
            longitude: 25.5402,
            city: "Sinaia",
            images: [],
          },
        ];
      }
    },
    async getLocalObjectives() {
      try {
       
        const data = await fetchApi(
          "Objectives/GetLocalObjectives",
          "post",
          this.filter
        );
        let response = data as IServiceResult;
        this.objectives = response.result;
      } catch (error) {
        console.error("Error fetch objective:", error);
        this.objectives = [
          {
            id: 1,
            name: "Castelul Bran",
            description:
              "Cunoscut și sub numele de Castelul lui Dracula, este situat în apropierea orașului Brașov.",
            latitude: 45.5155,
            longitude: 25.3674,
            city: "Bran",
            images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG"],
          },
          {
            id: 2,
            name: "Biserica Neagră",
            description:
              "Un simbol al orașului Brașov, aceasta este una dintre cele mai importante biserici gotice din România.",
            latitude: 45.5935,
            longitude: 25.5854,
            city: "Brașov",
            images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG"],
          },
          {
            id: 3,
            name: "Delta Dunării",
            description:
              "Un ecosistem unic în Europa, este o destinație populară pentru observarea păsărilor.",
            latitude: 45.1354,
            longitude: 29.5743,
            city: "Tulcea",
            images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG"],
          },
          {
            id: 4,
            name: "Transfăgărășan",
            description:
              "Una dintre cele mai frumoase și spectaculoase drumuri din România, oferind priveliști uimitoare.",
            latitude: 45.5952,
            longitude: 24.6423,
            city: "Sebeș",
            images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG"],
          },
          {
            id: 5,
            name: "Castelul Peleș",
            description:
              "Un castel magnific situat în Sinaia, considerat unul dintre cele mai frumoase din Europa.",
            latitude: 45.3535,
            longitude: 25.5402,
            city: "Sinaia",
            images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG/450px-Transf%C4%83g%C4%83r%C4%83%C8%99an_04.JPG"],
          },
        ];
      }
    },
    async updateObjective() {
      try {
        const data = await fetchApi(
          "Objectives/UpdateObjective",
          "put",
          undefined,
          this.selectedObjective
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
        this.getObjectives();
        return response.result;
      } catch (error) {
        console.error("Error deleting objective:", error);
      }
    },
    async uploadFile(file: File, objectiveId: number) {
      const formData = new FormData();
      formData.append("imageFile", file); // Numele trebuie să corespundă cu parametrul din API
      formData.append("objectiveId", String(objectiveId));

      try {
        const response = await fetchApi(
          "ObjectiveImage/UploadImage",
          "POST",
          formData,
          undefined,
          true
        );
        console.log("File uploaded successfully:", response);
        return response;
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    },
    async  importObjectives() {
      try {
        const data = await fetchApi("Objectives/ImportObjectives", "get");
        console.log("Added objective:", data);
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },  
    resetSelectedObjective() {
      this.selectedObjective = {
        id: 0,
        name: "",
        city: "",
        description: null,
        latitude: 0,
        longitude: 0,
        images: [],
        distance: 0,  
        duration: 0,
      };
    },
    resetFilterData(){
this.filter={latitude: null,
  longitude: null,
  maxDistance: null,
  name: "",
  typeId: null,
  minRating: null,}
    },
    async getById(id: number) {
      try {
        const data = await fetchApi(`Objectives/${id}`, "get");
        let response = data as IServiceResult;
        this.selectedObjective=response.result;
        return response.result;
      } catch (error) {
        console.error("Error fetching objective by id:", error);
        // Returnăm null în caz de eroare
        return null;
      }
    }, 
    async recommendObjectives(id: number) {
      try {
        const data = await fetchApi(`ML/recommendations/${id}`, "get");
        let response = data as IServiceResult;
        this.recommendedObjectives=response.result;
        return response.result;
      } catch (error) {
        console.error("Error fetching objective by id:", error);
        // Returnăm null în caz de eroare
        return null;
      }
    },
  },
  getters: {},
  persist: true,
});
