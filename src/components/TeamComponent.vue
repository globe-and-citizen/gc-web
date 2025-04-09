<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TeamMemberComponent from '@/components/TeamMemberComponent.vue'

const members = [
  {
    name: 'Dr. Ravi',
    skills: 'The Investor',
    image: '../assets/team/ravi.png',
    flag: '../assets/flags/canada.png'
  },
  {
    name: 'Arnon',
    skills: 'JS Developer',
    image: '../assets/team/Arnon.jpg',
    flag: '../assets/flags/brazil.png'
  },
  {
    name: 'Hermann',
    skills: 'JS Developer',
    image: '../assets/team/new_Hermann.jpg',
    flag: '../assets/flags/togo.png'
  },
  {
    name: 'Javokir',
    skills: 'JS/Go Developer',
    image: '../assets/team/Javokir.jpg',
    flag: '../assets/flags/uzbekistan.png'
  },
  {
    name: 'Daniel',
    skills: 'Go Developer',
    image: '../assets/team/new_Daniel.jpg',
    flag: '../assets/flags/kenya.png'
  },
  {
    name: 'Huzaifa',
    skills: 'Rust/Go Developer',
    image: '../assets/team/new_Huzaifa.jpeg',
    flag: '../assets/flags/pakistan.png'
  },
  {
    name: 'Taiba',
    skills: 'Article Writer',
    image: '../assets/team/taiba.jpg',
    flag: '../assets/flags/pakistan.png'
  },
  {
    name: 'Mashuk',
    skills: 'Article Writer',
    image: '../assets/team/mashuk.jpg',
    flag: '../assets/flags/bangladesh.png'
  },
  {
    name: 'Junwei',
    skills: 'Artist',
    image: '../assets/team/Junwei_tong.jpg',
    flag: '../assets/flags/singapore.png'
  },
  {
    name: 'Dasarath G',
    skills: 'Full Stack Web3 Engineer',
    image: '../assets/team/dasarath.png',
    flag: '../assets/flags/india.png'
  },
  {
    name: 'Osoro',
    skills: 'Rust/Go Developer',
    image: '../assets/team/osoro.jpg',
    flag: '../assets/flags/kenya.png'
  },
]

const currentIndex = ref(0)

let autoSlideInterval: number

// Function to handle navigation and reset the interval
const navigate = (direction: 'next' | 'prev') => {
  clearInterval(autoSlideInterval) // Clear the existing interval

  if (direction === 'next') {
    currentIndex.value = (currentIndex.value + 1) % members.length
  } else if (direction === 'prev') {
    currentIndex.value = (currentIndex.value - 1 + members.length) % members.length
  }

  // Reset the interval to start again from 3 seconds
  autoSlideInterval = setInterval(nextMember, 3000)
}

const nextMember = () => {
  navigate('next')
}

const prevMember = () => {
  navigate('prev')
}

onMounted(() => {
  autoSlideInterval = setInterval(nextMember, 3000)
})

onUnmounted(() => {
  clearInterval(autoSlideInterval)
})
</script>

<template>
  <section id="team">
    <div class="container px-5 py-12 mx-auto text-center">
      <div class="flex flex-col w-full mb-2">
        <h2 class="text-5xl font-bold">Contributors</h2>
        <p class="lg:w-2/3 mx-auto leading-relaxed py-8">
          Distributed from day 1. We are a fully remote company spread around the world.
        </p>
      </div>
      <div class="flex flex-wrap -m-2 overflow-hidden relative justify-center">
        <Transition name="slide" mode="out-in">
          <TeamMemberComponent :member="members[currentIndex]" :key="currentIndex" />
        </Transition>
      </div>
      <div class="flex justify-center mt-10">
        <button @click="prevMember" class="bg-gray-200 px-3 py-1 mr-2 rounded">Prev</button>
        <button @click="nextMember" class="bg-gray-200 px-3 py-1 ml-2 rounded">Next</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  text-align: center;
  /* Ensures all content within the container is centered */
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
