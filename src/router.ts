import { createWebHistory, createRouter } from "vue-router";

// import AboutView from './AboutView.vue'
// import App from "./App.vue";
import { defineAsyncComponent } from "vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: defineAsyncComponent(()=>import("./views/MainPage.vue")) },
    {
      path: "/login",
      component: defineAsyncComponent(() => import("./views/LoginPage.vue")),
    },
    { path: "/objectives", component: defineAsyncComponent(() => import("./views/ObjectivesPage.vue")) },
    { path: "/profile", component: defineAsyncComponent(() => import("./views/ProfilePage.vue")) },
    { path: "/setup", component: defineAsyncComponent(() => import("./views/AdministrationPage.vue")) },
    { path: "/favouriteObjectives", component: defineAsyncComponent(() => import("./views/FavouriteObjectivesPage.vue")) },
    { path: "/events", component: defineAsyncComponent(() => import("./views/EventsPage.vue")) },
    { path: "/events/:id", component: defineAsyncComponent(() => import("./components/events/EventDetailPage.vue")) },
    { path: "/objectives/:id", component: defineAsyncComponent(() => import("./components/objectives/ObjectiveDetailPage.vue")) },
  ],
});
export default router;
