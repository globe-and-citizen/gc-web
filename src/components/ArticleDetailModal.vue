<template>
    <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-6 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-2xl mb-4">{{ article.title }}</h2>
            <p class="mb-2"><strong>Author:</strong> {{ article.author }}</p>
            <p class="mb-2"><strong>Date:</strong> {{ article.date }}</p>
            <p>Description: {{ article.content }}</p>
            <button class="mt-4 bg-blue-500 text-white p-2 rounded" @click="closeModal">Close</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

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

.p-6 {
    padding: 1.5rem;
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.w-96 {
    width: 24rem;
}
</style>