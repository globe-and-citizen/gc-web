<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['journeyStarted'])

const journeyStart = () => {
  emit('journeyStarted')
}
</script>

<template>
  <div class="hero py-20 border-black border-b-2" style="background-image: url('/hero-bg.svg')">
    <div class="hero-content text-center">
      <div class="max-w-lg">
        <h1 class="text-7xl font-bold">The adventure <span @click="journeyStart" class="hover:bg-gradient-text hover:bg-clip-text hover:text-transparent cursor-pointer">start here</span></h1>
        <p class="py-8">
          Globe & Citizen has set out to be Web3.0’s premier distributed news network. We are made possible by the dedicated work of contributors spread around the world. If you are interested in getting involved, reach out to us on Discord or visit our Github page.
        </p>
        <div class="flex gap-6">
          <a class="btn btn-primary" href="https://discord.gg/Cjrq7nF3">Join Discord</a>
          <a class="btn btn-outline" href="https://github.com/globe-and-citizen/">Github</a>
        </div>
      </div>
    </div>
  </div>
</template>