<script setup lang="ts">
// import layer8 from 'layer8-interceptor-rs'
import * as layer8 from 'layer8-interceptor-rs'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'
import GallerySection from '@/components/GallerySection.vue'
import CameraCaptureSection from '@/components/CameraCapture.vue'
import CreateArticleModal from '@/components/CreateArticleModal.vue'

const BACKEND_URL = 'http://localhost:5001'; //import.meta.env.VITE_BACKEND_URL
const router = useRouter()

const showCreateArticleModal = ref(false);

const loginWithLayer8Popup = async () => {
  const response = await layer8.fetch(BACKEND_URL + "/api/login/layer8/auth", null)
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

const openCreateArticleModal = () => {
  showCreateArticleModal.value = true;
};

window.addEventListener('close-create-article-modal', () => {
  showCreateArticleModal.value = false;
  // window.location.reload();
});

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
  <main class="h-full flex flex-col justify-between">
    <div>
      <NavBarComponent />
      <HeroComponent @journey-started="handleJourneyStarted" />
      <AboutComponent />
      <!-- <TeamComponent /> -->
      <TimelineComponent />
      <Suspense>
        <template #default>
          <BlogSection />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
      <div class="text-center my-4">
        <button @click="openCreateArticleModal" class="bg-blue-500 text-white p-3 rounded">Create Article</button>
      </div>
      <Suspense>
        <template #default>
          <GallerySection />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
      <Suspense>
        <template #default>
          <CameraCaptureSection />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
      
    </div>
    <FooterComponent />
    <CreateArticleModal :show="showCreateArticleModal" />
  </main>
</template>

<style scoped>
button {
  cursor: pointer;
}

.bg-gray-600 {
  background-color: #4a5568;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.bg-white {
  background-color: #fff;
}

.text-white {
  color: #fff;
}

.text-center {
  text-align: center;
}

.p-3 {
  padding: 0.75rem;
}

.rounded {
  border-radius: 0.375rem;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.p-6 {
  padding: 1.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.w-96 {
  width: 24rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.border {
  border: 1px solid #e2e8f0;
}

.p-2 {
  padding: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
