<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
</script>

<template>
  <main class="h-full flex flex-col justify-between">
    <div>
      <NavBarComponent></NavBarComponent>
      <RouterView />
    </div>
    <FooterComponent></FooterComponent>
  </main>
</template>

<style scoped></style>
