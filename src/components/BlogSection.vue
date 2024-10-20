<template>
  <section class="container mx-auto border-y-2 border-black" id="blog">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <h2 class="text-5xl font-bold">Articles Published by Our Team Members</h2>
      </div>
      <div class="relative">
        <button @click="scrollLeft" class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow">←</button>
        <div class="overflow-hidden">
          <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * itemWidth}px)` }" ref="scrollContainer">
            <ArticleCard v-for="(article, index) in articles" :article="article" :key="index" class="flex-shrink-0 w-1/3 px-10" />
          </div>
        </div>
        <button @click="scrollRight" class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow">→</button>
      </div>
      <ArticleDetailModal :show="showArticleModal" v-if="selectedArticle" :article="selectedArticle" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import layer8 from 'layer8_interceptor';
import ArticleCard from '@/components/ArticleCard.vue';
import ArticleDetailModal from '@/components/ArticleDetailModal.vue';

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

interface ArticleEvent extends CustomEvent {
  detail: Article;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const itemWidth = 1 / 3 * 100; // 1/3rd of the container width
const currentIndex = ref(0);
const showArticleModal = ref(false);
const selectedArticle = ref<Article | null>(null);

const { data: articles = [] } = useQuery({
  queryKey: ['articles'],
  queryFn: async () => {
    const response = await layer8.fetch(BACKEND_URL + "/api/blog");
    return response.json();
  },
});

const scrollRight = () => {
  if (currentIndex.value < Math.ceil(articles.length / 3) - 1) {
    currentIndex.value += 1;
  }
};

const scrollLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};

window.addEventListener('open-article-modal', (event: Event) => {
  const customEvent = event as ArticleEvent;
  selectedArticle.value = customEvent.detail;
  showArticleModal.value = true;
});

window.addEventListener('close-article-modal', () => {
  showArticleModal.value = false;
  selectedArticle.value = null;
});
</script>

<style scoped>
button {
  background: none;
  border: none;
  color: #000;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
}

button:focus {
  outline: none;
}

.flex {
  display: flex;
}
</style>
