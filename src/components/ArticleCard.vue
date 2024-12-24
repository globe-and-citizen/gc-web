<template>
  <div class="p-4 md:w-1/3">
    <div class="card border border-black rounded-lg overflow-hidden relative" style="box-shadow: 2px 2px 0 0 #000">
      <button @click="deleteArticle" class="absolute top-2 right-2 text-red-600 hover:text-red-800">
        <img v-if="isLoading" style="width: 24px; height: 24px;" :src="loading" alt="...">
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="p-6 card-body" @click="openArticleModal">
        <h3 class="card-title line-clamp-2">{{ article.title }}</h3>
        <p class="leading-relaxed mb-3 line-clamp-3">{{ article.content }}</p>
        <p class="leading-relaxed mb-5" style="font-size: 1rem">Posted by: {{ article.author }}</p>
        <div class="flex items-center flex-wrap">
          <span
            class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs } from 'vue';
// import layer8 from 'layer8-interceptor-rs';
import * as layer8 from 'layer8-interceptor-rs';
import { useQueryClient } from '@tanstack/vue-query';
import loading from '@/assets/loading.gif';

const queryClient = useQueryClient();
const isLoading = ref(false);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Article {
  id: number;  // Ensure id is included here
  title: string;
  content: string;
  author: string;
}

interface Props {
  article: Article;
}

const props = defineProps<Props>();
const { article } = toRefs(props);

const deleteArticle = async () => {
  isLoading.value = true;
  try {
    const response = await layer8.fetch(`${BACKEND_URL}/api/blog/${article.value.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      window.dispatchEvent(new CustomEvent('article-deleted', { detail: article.value.id }));
      // window.location.reload();
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    } else {
      console.error('Failed to delete the article');
    }
  } catch (err) {
    console.error('Error: ', err);
  }
  isLoading.value = false;
};

const openArticleModal = () => {
  window.dispatchEvent(new CustomEvent('open-article-modal', { detail: article.value }));
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 3;
  /* Show only 3 lines */
}
</style>