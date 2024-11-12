<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue';
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

let scrollInterval: number | null = null;

const isScrolling = ref(false);
const toggleScroll = () => {
  if (isScrolling.value) {
    clearInterval(scrollInterval as number);
    scrollInterval = null;
  } else {
    scrollInterval = setInterval(() => {
      window.scrollBy(0, 2);
    }, 16);
  }
  isScrolling.value = !isScrolling.value;
};

const { fetchImages, isLoaded, images } = useFetchImages({
  endpoint: `${BACKEND_URL}/api/gallery-one`,
});

watch(isLoaded, async (loaded) => {
  if (loaded) {
    await nextTick();
    // gsapAnimation();
  }
});

const goToImaginaryWorld = () => {
  router.push({ name: 'imaginary-world' });
  isScrolling.value = !isScrolling.value
};

const goToSecondImaginary = () => {
  router.push({ name: 'second-imaginary' });
  isScrolling.value = !isScrolling.value
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
      <section v-if="images.length === 0" class="notif">
        <p>No Images Found</p>
      </section>
      <section v-else>
        <div v-for="(image, index) in images" :key="index">
          <img :src="image.url" :alt="image.name" />
        </div>
      </section>
      <hr>
    </div>

    <div class="scroll-controls">
      <button @click="toggleScroll">{{ isScrolling ? 'Pause' : 'Play' }}</button>
    </div>
  </section>
</template>

<style scoped>
* {
  margin: 0 auto;
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

.scroll-controls {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.scroll-controls button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.scroll-controls button:hover {
  background-color: #357ABD;
  transform: scale(1.1);
}
</style>