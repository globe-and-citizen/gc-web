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
    image: '../assets/team/hermann.jpg'
  },
  {
    name: 'Javokir',
    title: 'The boss Again',
    image: '../assets/team/Javokir.jpg'
  },
  {
    name: 'Daniel',
    title: 'The boss of boss',
    image: '../assets/team/Daniel.jpg'
  },
  {
    name: 'Huzaifa',
    title: 'The boss Again',
    image: '../assets/team/huzaifa.jpeg'
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
          Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke
          farm-to-table. Franzen you probably haven't heard of them.
        </p>
      </div>
      <div class="flex flex-wrap -m-2">
        <TeamMemberComponent :member="member" v-for="(member, index) of members" :key="index" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
