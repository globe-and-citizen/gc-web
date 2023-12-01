<script setup lang="ts">
import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'

declare global {
  interface Window {
    called: () => void;
  }
}

const called = () : void =>{
  console.log("i'm called")
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
