import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
// import layer8 from 'layer8-interceptor-rs';
import * as layer8 from 'layer8-interceptor-rs';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PROXY_URL = import.meta.env.VITE_PROXY_URL;

try {
  layer8.initEncryptedTunnel({
    providers: [BACKEND_URL],
    proxy: PROXY_URL,
    staticPaths: [
      "/media",
      "/camera",
    ]
  }, "dev");
} catch (err) {
  console.log(".initEncryptedTunnel error: ", err);
}

const queryClient = new QueryClient();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient });

app.mount('#app');
