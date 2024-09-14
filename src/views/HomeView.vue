<script setup lang="ts">
import layer8 from 'layer8_interceptor'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { ref } from 'vue';

import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const router = useRouter()
const isRaining = ref(false);
let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let style: HTMLStyleElement | null = null;


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
            handleCodeRainingEffect(false);
            router.push({ name: 'imaginary-world' })
            popup.close();
          })
          .catch(err => console.log(err))
      }, 1000);
    }
  });
}

const handleCodeRainingEffect = (value: boolean) => {
  if (value) {
    if (intervalId) return;

    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    style = document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; }
      body { background: #000; }
      canvas { display: block; }
    `;
    document.head.appendChild(style);

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ'.split('');
    const fontSize = 10;
    
    const columns = Math.floor(canvas.width / fontSize);
    if (columns <= 0) return;

    const drops = Array(columns).fill(1);

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0;
        }
      }
    }

    intervalId = setInterval(draw, 33);
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (canvas) {
      document.body.removeChild(canvas);
      canvas = null;
    }
    if (style) {
      document.head.removeChild(style);
      style = null;
    }
  }
};


const handleJourneyStarted = () => {
  loginWithLayer8Popup()
}

const breakThrough = async () => {
  if (window.confirm("Are you sure you want to proceed?")) {
    isRaining.value = true;
    handleCodeRainingEffect(true);
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
})

</script>

<template>
  <main class="h-full flex flex-col justify-between" v-if="!isRaining">
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

<style lang="scss"></style>
