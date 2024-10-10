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
import { onMounted, ref } from 'vue';
import layer8_interceptor from 'layer8_interceptor';

const images = ref<any[]>([]); 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

const fetchImages = async () => {
  try {
    const res = await layer8_interceptor.fetch(`${BACKEND_URL}/api/gallery-one`, {//I am thinking about url naming
      method: 'GET',
    });
    const data = await res.json();
    
    if (data && data.images) {
      const imageArray = data.images.map((image: any) => ({
        id: image.id,
        name: image.name,
        url: await layer8_interceptor.static(image.url) 
      }));
      images.value = imageArray;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

onMounted(fetchImages);
</script>

<style>
</style>
