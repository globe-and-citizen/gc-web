<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
onMounted(() => {
  const token = localStorage.getItem("L8_TOKEN")
  if (!token) {
    useRouter().push({ name: 'home' })
  }

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
</script>

<template>
  <div class="wrapper">
    <div class="content">
      <section class="section hero"></section>
      <section class="section gradient-purple"></section>
      <section class="section gradient-blue"></section>
    </div>
    <div class="image-container">
      <img
        src="https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp"
        alt="image">
    </div>
  </div>
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
}

.content .section.hero {
  background-image: url(https://images.unsplash.com/photo-1589848315097-ba7b903cc1cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.image-container {
  width: 100%;
  height: 100vh;
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
</style>
