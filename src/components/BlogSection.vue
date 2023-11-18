<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'

const article = {
  title: 'The Catalyzer',
  description:
    'Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.',
  image: 'https://dummyimage.com/720x400',
  link: '#',
  category: 'CATEGORY',
  date: 'Mar 14'
}
</script>

<template>
  <section class="container mx-auto text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-wrap -m-4">
        <ArticleCard :article="article" v-for="i of [1, 2, 3]" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
