<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import layer8_interceptor from 'layer8_interceptor'
import { stopRainingEffect, triggerRainingEffect  } from '../utils/codeRainingEffect'
import eventBus from '../utils/eventBus';

const isLoaded = ref(false)
const images: any = ref([])
const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL
const loadingPercentage = ref(0);

gsap.registerPlugin(ScrollTrigger);

const fetchImages = async () => {
  console.log("fetchImages has run...")
  await layer8_interceptor.fetch(BACKEND_URL +'/api/gallery-one', {
    method: "GET"
  }).then( async (res) => {
    let json = await res.json()
    console.log("Fom '/api/gallery-one': ", json)
    return json
  }).then(async (data: any) => {
    const totalImages = data.data.length;
      var imgs = [];
      for (var i = 0; i < totalImages; i++) {
        const image = data.data[i];

        const startTime = performance.now();

        const url = await layer8_interceptor.static(image.url);

        const endTime = performance.now();
        const loadTime = (endTime - startTime).toFixed(2);

        imgs.push({
          id: image.id,
          name: image.name,
          url: url
        });

        loadingPercentage.value = Math.round(((i + 1) / totalImages) * 100);

        console.log(`Image ${i + 1} loaded in ${loadTime} ms`);
        console.log("PERCENTAGE", loadingPercentage.value)

        // triggerRainingEffect('imaginary', loadingPercentage.value);
        eventBus.emit('loading-percentage', loadingPercentage.value); 
      }
      images.value = imgs;
      isLoaded.value = true;
    }).then(()=>{
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
    setTimeout(() => { stopRainingEffect() }, 1000)
    // stopRainingEffect()
    })
    .catch((err: any) => {
      stopRainingEffect()
      console.log(err)
    });
}

const router = useRouter();

const goToImaginaryWorld = () => {
  router.push({ name: 'imaginary-world' });
}

const goToSecondImaginary = () => {
  router.push({ name: 'second-imaginary' });
}

fetchImages()

onMounted(async () => {
  const token = localStorage.getItem("L8_TOKEN")
  if (!token) {
    useRouter().push({ name: 'home' })
  }
})

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

.left-button {
}

.right-button {
}

</style>