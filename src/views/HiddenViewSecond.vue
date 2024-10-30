<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchImages } from '@/utils/useFetchImages';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const gsapAnimation = () => {
  if (document.querySelector('.wrapper')) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.wrapper',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
      },
    })
    .to('.hero img', {
      scale: 2,
      z: 350,
      transformOrigin: 'center center',
      ease: 'power1.inOut',
    })
    .to('.hero', {
      scale: 1.1,
      transformOrigin: 'center center',
      ease: 'power1.inOut',
    }, '<');
  }
};

const { fetchImages, isLoaded, images } = useFetchImages({
  endpoint: `${BACKEND_URL}/api/gallery-two`,
});

watch(isLoaded, async (loaded) => {
  if (loaded) {
    await nextTick();
    gsapAnimation();
  }
});

const goToImaginaryWorld = () => {
  router.push({ name: 'imaginary-world' });
};

const goToSecondImaginary = () => {
  router.push({ name: 'second-imaginary' });
};

fetchImages();

onMounted(() => {
  const token = localStorage.getItem("L8_TOKEN");
  if (!token) {
    router.push({ name: 'home' });
  }
});
</script>

<template>
  <section v-if="isLoaded">
    <div class="navigation-buttons">
      <button class="nav-button left-button" @click="goToImaginaryWorld">
        <span>&#9664;</span>  
      </button>
      <button class="nav-button right-button" @click="goToSecondImaginary">
        <span>&#9654;</span>
      </button>
    </div>

    <div class="wrapper">
      <div class="content">
        <section class="section hero">
          <img :src="images[1]?.url" alt="background-img">
        </section>
      </div>
      <div class="image-container">
        <img :src="images[0]?.url" id="hero-img" alt="hero image">
      </div>
      <hr>
      <section v-if="images.length === 0" class="notif">
        <p>No Images Found</p>
      </section>
      <section v-else>
        <div v-for="(image, index) in images.slice(2, 5)" :key="index">
          <img :src="image.url" :alt="image.name" />
        </div>
      </section>
      <hr>
    </div>
  </section>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wrapper,
.content {
  position: relative;
  width: 100%;
  z-index: 1;
}

.content {
  overflow-x: hidden;
}

.content .section {
  width: 100%;
  height: 100vh;
  position: relative;
}

.content .section.hero {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.image-container {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  perspective: 500px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
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
</style>