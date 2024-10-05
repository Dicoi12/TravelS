import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import BadgeDirective from "primevue/badgedirective";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import ToastService from "primevue/toastservice";
import router from "./router";

import App from "./App.vue";

const app = createApp(App);

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// PrimeVue components and directives
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.directive("tooltip", Tooltip);
app.directive("badge", BadgeDirective);
app.component("InputGroup", InputGroup);
app.component("InputGroupAddon", InputGroupAddon);

// Mount the app to #app (adjust HTML to have this element)
app.mount("#app");
