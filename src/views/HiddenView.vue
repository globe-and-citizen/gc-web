<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchImages } from '@/utils/useFetchImages';
import { useFetchMusic } from '@/utils/useFetchMusic';
import { startScroll, stopScroll, isScrolling } from '@/utils/scrollingPage';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '@/assets/chapters.css';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const isScrollActive = ref(false);
const audio = ref<HTMLAudioElement | null>(null);

const handleScrollEnd = () => {
  stopScroll();
  isScrollActive.value = false;
  audio.value?.pause();
};

const toggleScroll = () => {
  if (isScrollActive.value) {
    stopScroll();
    audio.value?.pause();
  } else {
    startScroll(handleScrollEnd);
    audio.value?.play();
  }
  isScrollActive.value = isScrolling();
};

const { fetchImages, isLoaded, images } = useFetchImages({
  endpoint: `${BACKEND_URL}/api/gallery-one`,
});

const { fetchMusic, musicFile } = useFetchMusic({
  endpoint: `${BACKEND_URL}/api/bg-music-chapter-one`,
});

watch(isLoaded, async (loaded) => {
  if (!loaded) return;

  await nextTick();

  await Promise.all(
    Array.from(document.querySelectorAll('.wrapper img'), (img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => img.addEventListener('load', resolve, { once: true }))
    )
  );

  animateImages();
  animateCharacters();
});

const goToSecondImaginary = () => {
  stopScroll();
  audio.value?.pause();
  router.push({ name: 'second-imaginary' });
};

fetchImages();
fetchMusic();

onMounted(() => {
  const token = localStorage.getItem("L8_TOKEN");
  if (!token) {
    router.push({ name: 'home' });
  }
  watch(
    () => musicFile.value?.url,
    (url) => {
      if (url) {
        audio.value = new Audio(url);
        audio.value.loop = true;
      }
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  stopScroll();
  audio.value?.pause();
});

const animateImages = () => {
  gsap.utils.toArray('.wrapper img').forEach((img) => {
    gsap.fromTo(
      img,
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      }
    );
  });
};

const animateCharacters = () => {
  const oldMan = document.querySelector('.old-man');
  const thinkingMan = document.querySelector('.thinking-man');
  if (oldMan) {
    gsap.fromTo(
      oldMan,
      { x: '200', opacity: 1 },
      {
        x: '-300',
        opacity: 1,
        duration: 3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: oldMan,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      }
    );
  }
  if (thinkingMan) {
    gsap.fromTo(
      thinkingMan,
      { x: '-400', opacity: 1 },
      {
        x: '300',
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: oldMan,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      }
    );
  }
};
</script>

<template>
  <section v-if="isLoaded">
    <div class="navigation-button right-button">
      <button class="nav-button" @click="goToSecondImaginary">
        <span class="nav-text">Next Chapter</span>
        <span class="nav-arrow">&#9654;</span>
      </button>
    </div>

    <img class="old-man" src="@/assets/characters/old-man.webp" alt="Old Man" />
    <img class="thinking-man" src="@/assets/characters/thinking-man.webp" alt="Thinking Man" />

    <div class="wrapper">
      <section v-if="images.length === 0" class="notif">
        <p>No Images Found</p>
      </section>
      <section v-else>
        <div v-for="(image, index) in images" :key="index">
          <img :src="image.url" :alt="image.name" />
        </div>
      </section>
      <hr />
    </div>
    <div class="scroll-controls">
      <button @click="toggleScroll" :class="{ active: isScrollActive }" class="toggle-button">
        <span v-if="isScrollActive" class="pause-icon"></span>
        <span v-else class="play-icon"></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.old-man {
  position: absolute;
  z-index: 10;
  top: 50%;
  right: 0;
  max-width: 300px;
  pointer-events: none;
  overflow-x: hidden;
}
.thinking-man {
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;
  max-width: 300px;
  pointer-events: none;
  overflow-x: hidden;
}
</style>