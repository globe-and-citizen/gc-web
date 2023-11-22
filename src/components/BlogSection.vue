<script setup lang="ts">
import ArticleCard from '@/components/ArticleCard.vue'
import { ref } from 'vue'

const article = {
  title: 'The Catalyzer',
  description:
    'Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.',
  image: 'https://dummyimage.com/720x400',
  link: '#',
  category: 'CATEGORY',
  date: 'Mar 14'
}
const articles = ref()

// fetch articles from api
fetch('https://dev.to/api/articles?username=hermannleboss')
  .then((res) => res.json())
  .then((data) => {
    articles.value = data
  })
  .catch((err) => console.log(err))
</script>

<template>
  <section class="container mx-auto border-y-2 border-black" id="blog">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <h2 class="text-5xl font-bold">Recent Articles</h2>
      </div>
      <div class="flex flex-wrap -m-4">
        <ArticleCard v-if="articles" :article="articles[i]" v-for="i of [0, 1, 2]" :key="i" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
