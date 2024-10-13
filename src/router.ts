import { createWebHistory, createRouter } from "vue-router";

// import AboutView from './AboutView.vue'
import App from "./App.vue";
import { defineAsyncComponent } from "vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: "/", component: App },
    {
      path: "/login",
      component: defineAsyncComponent(() => import("./views/LoginPage.vue")),
    },
    { path: "/objectives", component: defineAsyncComponent(() => import("./views/ObjectivesPage.vue")) },
    { path: "/profile", component: defineAsyncComponent(() => import("./views/ProfilePage.vue")) },
  ],
});
export default router;
