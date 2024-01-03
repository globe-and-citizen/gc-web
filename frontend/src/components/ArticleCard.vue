<template>
  <div class="p-4 md:w-1/3">
    <div
      class="card border border-black rounded-lg overflow-hidden"
      style="box-shadow: 2px 2px 0 0 #000"
    >
      <img class="w-full object-contain object-center" :src="article.cover_image" alt="blog" />
      <div class="p-6 card-body">
        <p class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
          {{ article.category }}
        </p>
        <h3 class="card-title line-clamp-2">{{ article.title }}</h3>
        <p class="leading-relaxed mb-3">
          {{ article.description }}
        </p>
        <div class="flex items-center flex-wrap">
          <a class="btn btn-outline" :href="article.url"
            >Learn More
            <svg
              class="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <span
            class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1"
          >
            <svg
              class="w-4 h-4 mr-1"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              ></path></svg
            >{{ article.comments_count }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Article {
  category: string
  description: string
  image: string
  title: string
  url: string
  comments_count: number
  cover_image: string
}

interface Props {
  article: Article
}

defineProps<Props>()
</script>
