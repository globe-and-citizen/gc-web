import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { triggerRainingEffect } from '@/utils/codeRainingEffect'; 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/imaginary',
      name: 'imaginary-world',
      component: () => import('../views/HiddenView.vue'),
    },
    {
      path: '/second-imaginary',
      name: 'second-imaginary',
      component: () => import('../views/HiddenViewSecond.vue'),
    },
    {
      path: '/oauth2/callback',
      name: 'oauth2-callback',
      component: () => import('../views/OauthView.vue'),
    }
  ]
})



router.beforeEach((to, from, next) => {
  if (to.name !== "home") {
    triggerRainingEffect(to.name);
    setTimeout(() => {
      next();
    }, 1000);
  }else{
    next();
  }
});

export default router