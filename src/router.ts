import { createWebHistory, createRouter } from "vue-router";

import Layout from "./components/Layout.vue";
// import AboutView from './AboutView.vue'
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: App },
    //   { path: '/projects', component: ProjectsPage }
  ],
});
export default router;
