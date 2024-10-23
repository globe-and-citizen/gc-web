<template>
    <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-34 overflow-y-auto">
            <h2 class="text-2xl mb-4">{{ article.title }}</h2>
            <p class="mb-2"><strong>Author:</strong> {{ article.author }}</p>
            <p class="mb-2"><strong>Date:</strong> {{ article.date }}</p>
            <p class="text-justify">Description: {{ article.content }}</p> <!-- Added text-justify class -->
            <button class="mt-4 bg-blue-500 text-white p-2 rounded mr-2" @click="closeModal">Close</button>
            <button class="mt-4 bg-red-500 text-white p-2 rounded" @click="deleteArticle">Delete</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, toRefs } from 'vue';
import layer8 from 'layer8_interceptor';
import { useQueryClient } from '@tanstack/vue-query';


interface Article {
    id: number;  // Ensure id is also included here
    title: string;
    content: string;
    author: string;
    date: string;
}

interface Props {
    show: boolean;
    article: Article;
}

const props = defineProps<Props>();

const closeModal = () => {
    window.dispatchEvent(new CustomEvent('close-article-modal'));
};

const isLoading = ref(false);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const { article } = toRefs(props);
const queryClient = useQueryClient();


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
      queryClient.invalidateQueries(['articles']);
    } else {
      console.error('Failed to delete the article');
    }
  } catch (err) {
    console.error('Error: ', err);
  }
  isLoading.value = false;
  window.dispatchEvent(new CustomEvent('close-article-modal'));
};
</script>

<style scoped>
.fixed {
    position: fixed;
}

.inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.flex {
    display: flex;
}

.justify-center {
    justify-content: center;
}

.items-center {
    align-items: center;
}

.bg-white {
    background-color: #fff;
}

.p-6 {
    padding: 1.5rem;
}

.rounded-lg {
    border-radius: 0.5rem;
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.w-full {
    width: 100%;
}

.max-w-3xl {
    max-width: 48rem;
}

.max-h-34 {
    max-height: 75vh;
}

.overflow-y-auto {
    overflow-y: auto;
}

.text-justify {
    text-align: justify;
}
</style>
