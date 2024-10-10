import { createWebHistory, createRouter } from "vue-router";

// import AboutView from './AboutView.vue'
import App from "./App.vue";
import LoginPage from "./views/LoginPage.vue";
import ObjectivesPage from "./views/ObjectivesPage.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: App },
    { path: "/login", component: LoginPage },
    { path: "/objectives", component: ObjectivesPage },
    //   { path: '/projects', component: ProjectsPage }
  ],
});
export default router;
