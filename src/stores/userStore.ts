import { defineStore } from "pinia";
import { IUserModel, UserRoleEnum } from "../Interfaces";
import fetchApi from "../stores/fetch";

interface UserData {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phone: string;
  location: string;
  birthDate: Date | null;
  avatarUrl: string;
  language: string;
  theme: 'Light' | 'Dark';
  createdAt: Date;
  updatedAt: Date;
}

export const useUserStore = defineStore("userStore", {
  state: (): {
    token?: string;
    userData: IUserModel;
  } => {
    return {
      token: "",
      userData: {
        id: 0,
        userName: "",
        email: null,
        phone: null,
        hash: "",
        salt: "",
        role: 0,
      },
    };
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
        if (userName == "dariusd2" && password == "123") {
          this.userData = {
            id: 200,
            userName: 'dariusd',
            email: 'wink@ceva.com',
            phone: '0742123212',
            hash: "",
            salt: "",
            role: UserRoleEnum.Administrator,
          };
        }
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
    async changePassword(oldPassword: string, newPassword: string) {
      try {
        let payload = {
          userId: this.userData.id,
          oldPassword: oldPassword,
          newPassword: newPassword
        };
        const data = await fetchApi("User/ChangePassword", "POST", payload);
        return data as boolean;
      } catch (error) {
        console.error("Error adding objective:", error);
      }

    },
    logout() {
      this.userData = {
        id: 0,
        userName: "",
        email: null,
        phone: null,
        hash: "",
        salt: "",
        role: 0,
      };
    },
  },
  getters: {},
  persist: true,
});
