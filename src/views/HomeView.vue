<script setup lang="ts">
import layer8 from 'layer8_interceptor'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'

const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL
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
            router.push({ name: 'hidden' })
            popup.close();
          })
          .catch(err => console.log(err))
      }, 1000);
    }
  });
}

declare global {
  interface Window {
    startImaginaryWorld?: () => void
  }
}

// Attach the function to the window object when the component is mounted
onMounted(() => {
  window.startImaginaryWorld = loginWithLayer8Popup
})

</script>

<template>
  <main>
    <HeroComponent />
    <AboutComponent />
    <TeamComponent />
    <TimelineComponent />
    <BlogSection />
  </main>
</template>

<style lang="scss"></style>
