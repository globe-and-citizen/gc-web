<script setup lang="ts">
interface Item {
  date: string
  title: string
  description: string
}

interface Props {
  item: Item
  position: string
  active: boolean
}

withDefaults(defineProps<Props>(), {
  position: 'start',
  active: false
})
</script>
<template>
  <li>
    <div class="timeline-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div
      class="mb-10"
      :class="`timeline-${position} ${position == 'start' ? 'md:text-end' : 'md:text-start'}`"
    >
      <time class="font-mono italic">{{ item.date }}</time>
      <div class="text-2xl font-black my-3">{{ item.title }}</div>
      <p>
        {{ item.description }}
      </p>
    </div>
    <hr :class="active ? 'bg-primary' : ''" />
  </li>
</template>
