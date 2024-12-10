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
  const characters = [
        { selector: ".character-1", startX: "1000%", endX: "50%" },
        { selector: ".character-2", startX: "100%", endX: "400%" },
        { selector: ".character-3", startX: "200%", endX: "50%" },
        { selector: ".character-4", startX: "-200%", endX: "50%" },
      ];

  characters.forEach(({ selector, startX, endX }) => {
    gsap.fromTo(
      selector,
      { x: startX, opacity: 0 },
      {
        x: endX,
        opacity: 1,
        scrollTrigger: {
          trigger: selector,
          start: "top center",
          end: "+=200%",
          scrub: true,
          pin: true,
        },
      }
    );
  });
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

    <img class="character character-1" src="@/assets/characters/old-man.webp" alt="Old Man" />
    <img class="character character-2" src="@/assets/characters/thinking-man.webp" alt="Thinking Man" />
    <img class="character character-3" src="@/assets/characters/trenjpg2.png" alt="Tren 2" />
    <img class="character character-4" src="@/assets/characters/trenjpg.png" alt="Tren" />

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
.character {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  max-width: 100%;
  z-index: 9999;
  pointer-events: none;
  overflow-x: hidden;
}

.character-1 {
  top: 30%;
  left: 10%;
}
.character-2 {
  top: 250%;
  left: -10%;
  width: 20%;
}
.character-3 {
  top: 350%;
  left: 10%;
  width: 30%;
}
.character-4 {
  top: 550%;
  right: 20%;
  width: 30%;
}

@media screen and (max-width: 768px) {
  .character-1 {
    width: 100px;
  }
}

</style>