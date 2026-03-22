import { defineStore } from "pinia";
import { IUserModel, IToken } from "../Interfaces";
import fetchApi from "../stores/fetch";

export const useUserStore = defineStore("userStore", {
  state: (): {
    token?: string;
    userData: IUserModel;
  } => {
    return {
      token: localStorage.getItem('token') || undefined,
      userData: {
        id: 0,
        userName: "",
        email: null,
        phone: null,
        role: 0,
      },
    };
  },
  actions: {
    async login(userName: string, password?: string) {
      const payload = {
        userName,
        password,
      };
      try {
        const data = await fetchApi("user/Login", "POST", payload);
        const tokenResponse = data as IToken;
        this.token = tokenResponse.token;
        localStorage.setItem('token', tokenResponse.token);
        return tokenResponse;
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },
    async signup(
      userName: string,
      password?: string,
      email?: string,
      phone?: string
    ) {
      const payload = {
        userName,
        password,
        email,
        phone,
      };
      try {
        const data = await fetchApi("user/SignUp", "POST", payload);
        return data;
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    async changePassword(oldPassword: string, newPassword: string) {
      try {
        const payload = {
          userId: this.userData.id,
          oldPassword,
          newPassword,
        };
        const data = await fetchApi("user/ChangePassword", "POST", payload);
        return data;
      } catch (error) {
        console.error("Error changing password:", error);
      }
    },
    logout() {
      this.token = undefined;
      this.userData = {
        id: 0,
        userName: "",
        email: null,
        phone: null,
        role: 0,
      };
      localStorage.removeItem('token');
    },
  },
  getters: {},
  persist: true,
});
