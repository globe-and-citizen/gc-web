<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import layer8_interceptor from 'layer8_interceptor'

const isLoaded = ref(false)
const images: any = ref([])
const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL

// const isRaining = ref(false);
let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let style: HTMLStyleElement | null = null;
let loadingText: HTMLDivElement | null = null;
let loadingPercentage = 0;

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
      handleCodeRainingEffect(false);
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
    })
    .catch((err: any) => {
      console.log(err)
    });
}

const handleCodeRainingEffect = (value: boolean) => {
  if (value) {
    if (intervalId) return;

    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    style = document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; }
      body { background: #000; }
      #app { display: none; }
      canvas { display: block; }
      .loading-style {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff; /* White color */
        font-size: 48px; /* Larger font size */
        font-family: monospace;
        opacity: 1;
        animation: fadeIn 1s forwards;
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    loadingText = document.createElement('div');
    loadingText.className = 'loading-style';
    loadingText.textContent = `Loading... ${loadingPercentage}%`;
    document.body.appendChild(loadingText);

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const fontSize = 10;
    
    const columns = Math.floor(canvas.width / fontSize);
    if (columns <= 0) return;

    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (canvas.height / fontSize)));

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0;
        }
      }

      if (loadingPercentage < 100) {
        loadingPercentage++;
        loadingText.textContent = `Loading... ${loadingPercentage}%`;
      }
    }

    intervalId = setInterval(draw, 33);
  } else {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (canvas) {
      document.body.removeChild(canvas);
      canvas = null;
    }
    if (style) {
      document.head.removeChild(style);
      style = null;
    }
    if (loadingText) {
      loadingText.style.animation = 'fadeOut 1s forwards';
      loadingText.addEventListener('animationend', () => {
        document.body.removeChild(loadingText!);
        loadingText = null;
      });
    }
  }
};

fetchImages()
handleCodeRainingEffect(true);

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
    <router-link class="nav-button left-button" :to="{ name: 'imaginary-world' }">
      <span>&#9664;</span>  
    </router-link>
    <router-link class="nav-button right-button" :to="{ name: 'second-imaginary' }">
      <span>&#9654;</span>  
    </router-link>
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
      <section v-else >
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
<section v-else class="loader">
  <p>Loading </p> 
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
  /* background-image: url(https://images.unsplash.com/photo-1589848315097-ba7b903cc1cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D); */

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
