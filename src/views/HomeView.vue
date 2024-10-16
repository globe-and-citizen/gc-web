<script setup lang="ts">
import layer8 from 'layer8_interceptor'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { stopRainingEffect } from '../utils/codeRainingEffect'

import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const router = useRouter()

const loginWithLayer8Popup = async () => {
  const response = await layer8.fetch(BACKEND_URL + "/api/login/layer8/auth")
  const data = await response.json()
  const popup = window.open(data.authURL, "Login with Layer8", "width=600,height=600") as Window;

  window.addEventListener("message", async (event) => {
    if (event.data.redr) {
      setTimeout(() => {
        layer8.fetch(BACKEND_URL + "/api/login/layer8/auth", {
          method: "POST",
          headers: {
            "Content-Type": "Application/Json"
          },
          body: JSON.stringify({
            callback_url: event.data.redr,
          })
        })
          .then(res => res.json())
          .then(data => {
            localStorage.setItem("L8_TOKEN", data.token)
            router.push({ name: 'imaginary-world' })
            popup.close();
          })
          .catch(err => console.log(err))
      }, 1000);
    }
  });
}

const handleJourneyStarted = () => {
  loginWithLayer8Popup()
}

const breakThrough = async () => {
  if (window.confirm("Are you sure you want to proceed?")) {
    await loginWithLayer8Popup();
  } else {
    console.log("User chose not to proceed.");
  }
}

declare global {
  interface Window {
    startImaginaryWorld?: () => void
    breakThrough?: () => void
  }
}

onMounted(() => {
  window.startImaginaryWorld = loginWithLayer8Popup;
  window.breakThrough = breakThrough;
  stopRainingEffect()
})
</script>

<template>
  <main class="h-full flex flex-col justify-between">
    <div>
      <NavBarComponent></NavBarComponent>
      <HeroComponent @journey-started="handleJourneyStarted" />
      <AboutComponent />
      <TeamComponent />
      <TimelineComponent />
      <BlogSection />
    </div>
    <FooterComponent></FooterComponent>
  </main>
</template>

<style lang="scss">
.fade-out {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.fade-in {
  opacity: 1;
  transition: opacity 0.5s ease;
}
</style>
