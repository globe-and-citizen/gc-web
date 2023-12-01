<script setup lang="ts">
import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'
// import app store
import { useAppStore } from '@/stores/app'
import router from '@/router'

const appStore=useAppStore()
console.log("Call the function Called in the console to see the easteregg")

declare global {
  interface Window {
    called: () => void;
  }
}

const called = () : void =>{
  console.log("i'm called")
  appStore.call()

  // Redirect to about page
 router.push({ name: 'about' })
}
window.called = called;
</script>

<template>
  <main>
    <HeroComponent />
    <AboutComponent />
    <TeamComponent />
    <TimelineComponent />
    <BlogSection />
  </main>
</template>

<style lang="scss"></style>
