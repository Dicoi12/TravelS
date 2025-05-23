import { createWebHistory, createRouter } from "vue-router";
import { useUserStore } from "./stores/userStore";
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
    { path: "/experiences", component: defineAsyncComponent(() => import("./views/ExperiencesPage.vue")) },
    { path: "/experiences/:id", component: defineAsyncComponent(() => import("./components/experiences/ExperienceDetail.vue")) },
    { path: "/itineraries", component: defineAsyncComponent(() => import("./views/ItineraryPage.vue")) },
    { path: "/itineraries/:id", component: defineAsyncComponent(() => import("./components/itinerary/ItineraryDetailPage.vue")) },
  ],
});
router.beforeEach((to, from, next) => {
  const authStore = useUserStore();
  
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login'); 
  } else {
    next();
  }
});
export default router;
