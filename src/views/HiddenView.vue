<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchImages } from '@/utils/useFetchImages';
import { startScroll, stopScroll, isScrolling } from '@/utils/scrollingPage';
import '@/assets/chapters.css';
import musicFile from '@/assets/background_music/action-replay-matrika.mp3';

const router = useRouter();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const isScrollActive = ref(false);
const audio = ref<HTMLAudioElement | null>(null);

const toggleScroll = () => {
  if (isScrollActive.value) {
    stopScroll();
    audio.value?.pause();
  } else {
    startScroll(() => {
      isScrollActive.value = true;
    });
    audio.value?.play();
    console.log("ASA")
  }
  isScrollActive.value = isScrolling();
};

const { fetchImages, isLoaded, images } = useFetchImages({
  endpoint: `${BACKEND_URL}/api/gallery-one`,
});

watch(isLoaded, async (loaded) => {
  if (loaded) {
    await nextTick();
  }
});

const goToSecondImaginary = () => {
  stopScroll();
  audio.value?.pause();
  router.push({ name: 'second-imaginary' });
};

fetchImages();

onMounted(() => {
  const token = localStorage.getItem("L8_TOKEN");
  if (!token) {
    router.push({ name: 'home' });
  }
  audio.value = new Audio(musicFile);
  audio.value.loop = true;
});

onUnmounted(() => {
  stopScroll();
  audio.value?.pause();
});
</script>

<template>
  <section v-if="isLoaded">
    <div class="navigation-button right-button">
      <button class="nav-button" @click="goToSecondImaginary">
        <span class="nav-text">Next Chapter</span>
        <span class="nav-arrow">&#9654;</span>
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
      <button @click="toggleScroll" :class="{ active: isScrollActive }" class="toggle-button">
        <span v-if="isScrollActive" class="pause-icon"></span>
        <span v-else class="play-icon"></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
</style>