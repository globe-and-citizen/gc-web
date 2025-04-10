<template>
  <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
    <div
      class="h-full flex items-center border-black border p-6 rounded-lg"
      style="box-shadow: 2px 2px 0 0 #000"
    >
      <img
        alt="team"
        class="w-36 h-36 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
        :src="imgUrl"
      />
      <div class="flex-grow">
        <h3 class="font-bold text-2xl text-gray-700 py-2">{{ member.name }}</h3>
        <p class="text-xl">{{ member.skills }}</p>
        <img
          alt="flag"
          class="w-16 h-10 inline-block mt-4 border-black border rounded-md"
          :src="flagUrl"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
// props are passed in from the parent component
interface Member {
  name: string
  skills: string
  image: string
  flag: string
}

interface Props {
  member: Member
}

const props = defineProps<Props>()

const imgUrl = new URL(props.member.image, import.meta.url).href
const flagUrl = new URL(props.member.flag, import.meta.url).href
</script>
