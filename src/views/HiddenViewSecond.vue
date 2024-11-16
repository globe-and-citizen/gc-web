<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchImages } from '@/utils/useFetchImages';
import { startScroll, stopScroll, isScrolling } from '@/utils/scrollingPage';
import '@/assets/chapters.css';

const router = useRouter();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const isScrollActive = ref(false);

const handleScrollEnd = () => {
  stopScroll();
  isScrollActive.value = false;
};

const toggleScroll = () => {
  if (isScrollActive.value) {
    stopScroll();
  } else {
    startScroll(handleScrollEnd);
  }
  isScrollActive.value = isScrolling();
};

const { fetchImages, isLoaded, images } = useFetchImages({
  endpoint: `${BACKEND_URL}/api/gallery-two`,
});

watch(isLoaded, async (loaded) => {
  if (loaded) {
    await nextTick();
  }
});

const goToImaginaryWorld = () => {
  stopScroll();
  router.push({ name: 'imaginary-world' });
};

fetchImages();

onMounted(() => {
  const token = localStorage.getItem("L8_TOKEN");
  if (!token) {
    router.push({ name: 'home' });
  }
});

onUnmounted(() => {
  stopScroll();
});
</script>

<template>
  <section v-if="isLoaded">
    <div class="navigation-button left-button">
      <button class="nav-button" @click="goToImaginaryWorld">
        <span class="nav-text">Back</span>
        <span class="nav-arrow">&#9664;</span>
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