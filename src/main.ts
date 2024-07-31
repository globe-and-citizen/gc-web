import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import layer8 from 'layer8_interceptor'
const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL
const PROXY_URL =  import.meta.env.VITE_PROXY_URL

try{
  layer8.initEncryptedTunnel({
    providers: [BACKEND_URL],
    proxy: PROXY_URL // w orks
  }, "dev")
}catch(err){
  console.log(".initEncryptedTunnel error: ", err)
}

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
