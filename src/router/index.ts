import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { initEncryptedTunnel } from 'layer8-interceptor-rs';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PROXY_URL = import.meta.env.VITE_PROXY_URL;

const layer8_ = async () => {
  try {
    let layer8_ = await initEncryptedTunnel({
      provider: BACKEND_URL,
      proxy: PROXY_URL,
      staticPaths: [
        "/media",
        "/camera",
      ]
    }, "dev");

    // layer8_ready = true;
    return layer8_;
  } catch (err) {
    throw new Error(`Failed to initialize encrypted tunnel: ${err}`);
  }
};

let layer8 = await layer8_();

if (!layer8) {
  console.error("Failed to initialize network state. The app may not function correctly.");
} else {
  console.log("Network state initialized successfully.");
}

// props are passed by reference, so changes to network_state are reactive and happen in wasm linear memory
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: { layer8: layer8 }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/imaginary',
      name: 'imaginary-world',
      component: () => import('../views/HiddenView.vue'),
    },
    {
      path: '/oauth2/callback',
      name: 'oauth2-callback',
      component: () => import('../views/OauthView.vue'),
      props: { layer8: layer8 }
    }
  ]
})

export default router
