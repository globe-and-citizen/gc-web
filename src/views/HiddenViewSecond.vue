<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchImages } from '@/utils/useFetchImages';
import { startScroll, stopScroll, isScrolling } from '@/utils/scrollingPage';
import '@/assets/chapters.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { animateCharacters } from '@/utils/animateCharacters';

gsap.registerPlugin(ScrollTrigger);

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
    const characters = [
      { selector: ".character-1", startX: "1000%", endX: "50%" },
      { selector: ".character-2", startX: "100%", endX: "400%" },
      { selector: ".character-3", startX: "600%", endX: "50%" },
      { selector: ".character-4", startX: "-200%", endX: "50%" },
    ];
    animateCharacters(characters);
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

    <img class="character character-1" src="@/assets/characters/ruth_first.png" alt="" />
    <img class="character character-2" src="@/assets/characters/ruth_second.png" alt="" />
    <img class="character character-3" src="@/assets/characters/john_first.png" alt="" />
    <img class="character character-4" src="@/assets/characters/john_second.png" alt="" />

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
.character-1 {
  top: 30%;
  left: 10%;
  width: 10%;
}
.character-2 {
  top: 350%;
  left: -10%;
  width: 10%;
}
.character-3 {
  top: 500%;
  left: 10%;
  width: 10%;
}
.character-4 {
  top: 750%;
  right: 20%;
  width: 10%;
}
</style>