<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" v-if="show">
        <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-2xl mb-4">Create Article</h2>
            <form @submit.prevent="submitArticle">
                <div class="mb-4">
                    <label class="block mb-2">Title</label>
                    <input v-model="title" class="w-full border p-2" type="text" required />
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Author</label>
                    <input v-model="author" class="w-full border p-2" type="text" required />
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Content</label>
                    <textarea v-model="content" class="w-full border p-2" required></textarea>
                </div>
                <button type="submit" class="bg-blue-500 text-white p-2 rounded">Post</button>
                <button @click="close" type="button" class="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
            </form>
            <div v-if="successMessage" class="mt-4 text-green-600">
                {{ successMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue';
import layer8 from 'layer8_interceptor';
import { useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();

const props = defineProps<{ show: boolean }>();

const title = ref('');
const author = ref('');
const content = ref('');
const successMessage = ref('');

watch(() => props.show, (newVal) => {
    if (newVal) {
        title.value = '';
        author.value = '';
        content.value = '';
        successMessage.value = '';
    }
});

const submitArticle = async () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    await layer8.fetch(BACKEND_URL + "/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "Application/Json" },
        body: JSON.stringify({
            title: title.value,
            author: author.value,
            content: content.value,
        })
    })
        .then(res => res.json())
        .then(data => {
            queryClient.invalidateQueries(['articles']);
            successMessage.value = 'Article created successfully!';
            setTimeout(close, 2000);
        })
        .catch(err => {
            console.error(err);
            successMessage.value = 'Failed to create article.';
        });
};

const close = () => {
    window.dispatchEvent(new CustomEvent('close-create-article-modal'));
};
</script>

<style scoped>
button {
  cursor: pointer;
}

.bg-gray-600 {
  background-color: #4a5568;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.bg-white {
  background-color: #fff;
}

.text-white {
  color: #fff;
}

.text-center {
  text-align: center;
}

.p-3 {
  padding: 0.75rem;
}

.rounded {
  border-radius: 0.375rem;
}

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

.mb-4 {
  margin-bottom: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.border {
  border: 1px solid #e2e8f0;
}

.p-2 {
  padding: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
