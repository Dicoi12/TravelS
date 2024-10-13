import { defineStore } from "pinia";
import { IUserModel } from "../Interfaces";
import fetchApi from "../stores/fetch";
export const useUserStore = defineStore("userStore", {
  state: (): {
    token?: string;
    userData: IUserModel;
  } => {
    return {token:'',userData:{id: 0,
      userName: "",
      email:  null,
      phone:  null,
      hash: "",
      salt: ""}};
  },
  actions: {
    // async addObjective() {
    //   const payload = {
    //     name: "New Objective",
    //     description: "Objective description",
    //     latitude: 45.4215,
    //     longitude: -75.6919,
    //   };

    //   try {
    //     const data = await fetchApi(
    //       "Objectives/PostObjective",
    //       "POST",
    //       payload
    //     );
    //     console.log("Added objective:", data);
    //   } catch (error) {
    //     console.error("Error adding objective:", error);
    //   }
    // },
    // async getImage() {
    //   try {
    //     const data = await fetchApi("ObjectiveImage/getimage/1", "get");
    //     console.log("Added objective:", data);
    //   } catch (error) {
    //     console.error("Error adding objective:", error);
    //   }
    // },
    async login(
      userName: string,
      password?: string
    ): Promise<IUserModel | undefined> {
      const payload = {
        UserName: userName,
        Password: password,
      };
      try {
        const data = await fetchApi("User/Login", "POST", payload);
        this.userData = data as IUserModel;
        return data as IUserModel;
      } catch (error) {
        console.error("Error adding objective:", error);
      }
    },
    async signup(
      userName: string,
      password?: string,
      email?: string,
      phone?: string
    ) {
      const payload = {
        UserName: userName,
        Password: password,
        email: email,
        phone: phone,
      };
      try {
        const data = await fetchApi("User/SignUp", "POST", payload);
        return data;
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
  },
  getters: {},
  persist: true,
});
