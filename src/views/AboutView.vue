<template>
  <div>
    <div>
      <div class="sticky top-0 h-0">
        <img :src="images[0]?.url" alt="Image" class="w-1/6 ml-auto">
      </div>
      <img :src="images[1]?.url" alt="Image" style="width: 100%">
      <img :src="images[2]?.url" alt="Image" style="width: 100%">
    </div>

    <div>
      <div class="sticky top-0 h-0">
        <img :src="images[3]?.url" alt="Image" class="w-1/4 mr-auto">
      </div>
      <img :src="images[4]?.url" alt="Image" style="width: 100%">
      <img :src="images[5]?.url" alt="Image" style="width: 100%">
      <img :src="images[6]?.url" alt="Image" style="width: 100%">
    </div>

    <div class="relative mb-10">
      <div class="sticky top-0">
        <img :src="images[7]?.url" alt="Image" class="w-1/6 ml-auto">
      </div>
      <p class="w-1/4 m-auto text-6xl top-0">
        Here I was. Walking alone in the city. On my way to deal with another job while blasting funk jazz late into the night. Funk jazz had always kept me going....
      </p>
    </div>

    <img :src="images[8]?.url" alt="Image" style="width: 100%">
    <img :src="images[9]?.url" alt="Image" style="width: 100%">
    <img :src="images[10]?.url" alt="Image" style="width: 100%">
    
    <div class="relative">
      <div class="absolute bottom-0">
        <img :src="images[11]?.url" alt="Image" class="w-2/5 mr-auto">
      </div>
      <img :src="images[12]?.url" alt="Image" style="width: 100%">
    </div>

    <div>
      <div class="sticky top-0 h-0">
        <img :src="images[13]?.url" alt="Image" class="w-1/4 m-auto">
      </div>
      <img :src="images[14]?.url" alt="Image" style="width: 100%">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchImages } from '@/utils/useFetchImages';

const router = useRouter();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const { fetchImages, images } = useFetchImages({
  endpoint: `${BACKEND_URL}/api/about-gallery`,
});

fetchImages();

onMounted(() => {
  const token = localStorage.getItem("L8_TOKEN");
  if (!token) {
    router.push({ name: 'home' });
  }
});
</script>

<style scoped>
</style>
