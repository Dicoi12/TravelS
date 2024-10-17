import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: false // or '0.0.0.0' to bind to all interfaces
  },
  plugins: [
    vue(),
    AutoImport({
      /* options */
    }),
    Components({ resolvers: [PrimeVueResolver()] }),
    
  ],
});
