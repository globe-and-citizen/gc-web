<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import layer8_interceptor from 'layer8_interceptor'
import { startRainingEffect, stopRainingEffect } from '@/utils/codeRainingEffect';

const isLoaded = ref(false)
const images: any = ref([])
const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL

gsap.registerPlugin(ScrollTrigger);

const fetchImages = async () => {
  console.log("fetchImages has run...")
  layer8_interceptor.fetch(BACKEND_URL +'/api/gallery-one', {
    method: "GET"
  }).then( async (res) => {
    let json = await res.json()
    console.log("Fom '/api/gallery-one': ", json)
    return json
  }).then(async (data: any) => {
      var imgs = [];
      for (var i = 0; i < data.data.length; i++) {
        const image = data.data[i];
        const url = await layer8_interceptor.static(image.url);
        imgs.push({
          id: image.id,
          name: image.name,
          url: url
        });
      }
      images.value = imgs;
      isLoaded.value = true;
    }).then(()=>{
      stopRainingEffect();
      gsap
    .timeline({
      scrollTrigger: {
        trigger: '.wrapper',
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
      },
    })
    .to('img', {
      scale: 2,
      z: 350,
      transformOrigin: 'center center',
      ease: 'power1.inOut',
    })
    .to(
      '.section.hero',
      {
        scale: 1.1,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
      },
      '<'
    );
    })
    .catch((err: any) => {
      console.log(err)
      stopRainingEffect();
    });
}

fetchImages()
startRainingEffect();

onMounted(async () => {
  const token = localStorage.getItem("L8_TOKEN")
  if (!token) {
    useRouter().push({ name: 'home' })
  }
})

</script>

<template>
<section v-if="isLoaded">
  <div class="wrapper">
    <div class="content">
      <section class="section hero">
        <img :src="images[1].url" alt="background-img">
      </section>
    </div>
    <div class="image-container">
      <img :src="images[0].url" id="hero-img" alt="hero image">
    </div>
    <hr>
      <section v-if="images.length === 0" class="notif">
        <p>No Images Found</p>
      </section>
      <section v-else>
        <div>
          <img :src="images[2].url" alt="image.name" />
        </div>
        <div>
          <img :src="images[3].url" alt="image.name" />
        </div>
        <div>
          <img :src="images[4].url" alt="image.name" />
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
  /* height: 100vh; */
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

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100vw - 10rem);
  height: calc(100vh - 10rem);
}

.loader p {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.loader p::after {
  content: '...';
  animation: loading 1s infinite;
}

@keyframes loading {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
}

</style>