<script setup lang="ts">
import TeamMemberComponent from '@/components/TeamMemberComponent.vue'

const members = [
  {
    name: 'Ravi',
    title: 'The boss',
    image: '../assets/team/ravi.png'
  },
  {
    name: 'Arnon',
    title: 'The boss Again',
    image: '../assets/team/Arnon.jpg'
  },
  {
    name: 'Hermann',
    title: 'Another boss',
    image: '../assets/team/new_Hermann.jpg'
  },
  {
    name: 'Javokir',
    title: 'The boss Again',
    image: '../assets/team/Javokir.jpg'
  },
  {
    name: 'Daniel',
    title: 'The boss of boss',
    image: '../assets/team/new_Daniel.jpg'
  },
  {
    name: 'Huzaifa',
    title: 'The boss Again',
    image: '../assets/team/new_Huzaifa.jpeg'
  },
  {
    name: 'Taiba',
    title: 'The Queen boss',
    image: '../assets/team/taiba.jpg'
  },
  {
    name: 'Mashuk',
    title: 'The boss Again',
    image: '../assets/team/mashuk.jpg'
  },
  {
    name: 'LEO',
    title: 'Just The boss',
    image: '../assets/team/Junwei_tong.jpg'
  }
]
</script>

<template>
  <section id="team">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <h2 class="text-5xl font-bold">Our Team</h2>
        <p class="lg:w-2/3 mx-auto leading-relaxed py-8">
          Distributed from day 1. We are a fully remote company spread around the world.
        </p>
      </div>
      <div class="flex flex-wrap -m-2">
        <TeamMemberComponent :member="member" v-for="(member, index) of members" :key="index" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
