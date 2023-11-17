<script setup lang="ts">
import TeamMemberComponent from '@/components/TeamMemberComponent.vue'
import { ref } from 'vue'

const member = ref({
  name: 'John Doe',
  title: 'Software Engineer',
  image: 'https://dummyimage.com/80x80'
})
</script>

<template>
  <section>
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <h2 class="text-5xl font-bold">Our Team</h2>
        <p class="lg:w-2/3 mx-auto leading-relaxed py-8">
          Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke
          farm-to-table. Franzen you probably haven't heard of them.
        </p>
      </div>
      <div class="flex flex-wrap -m-2">
        <TeamMemberComponent :member="member" v-for="i of [1, 2, 3, 4, 5, 6, 7, 8]" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
