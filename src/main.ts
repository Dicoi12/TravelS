import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import Tooltip from "primevue/tooltip";
import BadgeDirective from "primevue/badgedirective";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import ToastService from "primevue/toastservice";
import router from "./router";
import '/node_modules/primeflex/primeflex.css'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'

import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            cssLayer: false,
            darkModeSelector: false || 'none',
        }
    }
});
app.use(ToastService);
app.directive("tooltip", Tooltip);
app.directive("badge", BadgeDirective);
app.component("InputGroup", InputGroup);
app.component("InputGroupAddon", InputGroupAddon);

app.mount("#app");
