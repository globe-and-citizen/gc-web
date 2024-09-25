<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// const isRaining = ref(false);
let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let style: HTMLStyleElement | null = null;
let loadingText: HTMLDivElement | null = null;
let loadingPercentage = 0;

const handleCodeRainingEffect = (value: boolean) => {
  if (value) {
    if (intervalId) return;

    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    style = document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; }
      body { background: #000; }
      #app { display: none; }
      canvas { display: block; }
      .loading-style {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff; /* White color */
        font-size: 48px; /* Larger font size */
        font-family: monospace;
        opacity: 1;
        animation: fadeIn 1s forwards;
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    loadingText = document.createElement('div');
    loadingText.className = 'loading-style';
    loadingText.textContent = `Loading... ${loadingPercentage}%`;
    document.body.appendChild(loadingText);

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const fontSize = 10;
    
    const columns = Math.floor(canvas.width / fontSize);
    if (columns <= 0) return;

    // Initialize drops with random starting positions
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (canvas.height / fontSize)));

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0; // Reset the drop position to 0
        }
      }

      if (loadingPercentage < 100) {
        loadingPercentage++;
        loadingText.textContent = `Loading... ${loadingPercentage}%`;
      }
    }

    intervalId = setInterval(draw, 33);
  } else {
    // Existing cleanup code
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
    if (loadingText) {
      loadingText.style.animation = 'fadeOut 1s forwards';
      loadingText.addEventListener('animationend', () => {
        document.body.removeChild(loadingText);
        loadingText = null;
      });
    }
  }
};



handleCodeRainingEffect(true);

onMounted(async () => {
  setTimeout(() => {
      handleCodeRainingEffect(false);
    }, 2000);
})
</script>
<template>
  <div class="">
    <div class="navigation-buttons">
      <router-link class="nav-button left-button" :to="{ name: 'imaginary-world' }">
        <span>&#9664;</span>  
      </router-link>
      <router-link class="nav-button right-button" :to="{ name: 'second-imaginary' }">
        <span>&#9654;</span>  
      </router-link>
    </div>
    <div>
      <div class="sticky top-0 h-0">
        <img src="/assets/art/item/1_old_man.png" alt="Image" class="w-1/6 ml-auto">
      </div>

      <img src="../../public/assets/art/1_young_man.png" alt="Image" style="width: 100%">
      <img src="../../public/assets/art/2_old_man.png" alt="Image" style="width: 100%">
    </div>
    <div>
      <div class="sticky top-0 h-0">
        <img src="/assets/art/item/2_thinking.png" alt="Image" class="w-1/4 mr-auto">
      </div>
      <img src="../../public/assets/art/3_city.png" alt="Image" style="width: 100%">
      <img src="../../public/assets/art/4_office.png" alt="Image" style="width: 100%">
      <img src="../../public/assets/art/5.png" alt="Image" style="width: 100%">
    </div>
    <div class="relative mb-10">
      <div class="sticky top-0">
        <img src="/assets/art/item/3_walking_man.png" alt="Image" class="w-1/6 ml-auto">
      </div>
      <p class="w-1/4 m-auto text-6xl top-0">Here I was. Walking alone in the city. On my way to deal with another job while blasting funk jazz late into the night. Funk jazz had  always kept me going....
      </p>

    </div>

    <img src="../../public/assets/art/6_Summer_Sky_in_City.png" alt="Image" style="width: 100%">
    // Scroll to right the train on the bottom of this image to make the transition
    <img src="../../public/assets/art/7_woman.png" alt="Image" style="width: 100%">
    // Scroll to left the train on the bottom of this image to make the transition
    <img src="../../public/assets/art/8_cars.png" alt="Image" style="width: 100%">
    <div class="relative">
      <div class="absolute bottom-0">
        <img src="/assets/art/item/5_riding.png" alt="Image" class="w-2/5 mr-auto">
      </div>
      <img src="../../public/assets/art/9_New_Chapter_Begins.png" alt="Image" style="width: 100%">
    </div>
    <div>
      <div class="sticky top-0 h-0">
        <img src="/assets/art/item/6_falling.png" alt="Image" class="w-1/4 m-auto">
      </div>
      <img src="../../public/assets/art/10_Road_to_utopia.png" alt="Image" style="width: 100%">
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
}

.navigation-buttons {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%); 
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 10px 0;
  z-index: 9999;
}

.nav-button {
  background-color: #ffffff;
  border: 2px solid #4a90e2;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.nav-button:hover {
  background-color: #4a90e2;
  color: #ffffff;
  transform: scale(1.1);
}

.left-button {
  /* Optional styles for positioning if needed */
}

.right-button {
  /* Optional styles for positioning if needed */
}

</style>
<script setup lang="ts">
</script>