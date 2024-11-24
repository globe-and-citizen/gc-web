<template>
  <section class="container mx-auto border-y-2 border-black" id="blog">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-20">
        <h2 class="text-5xl font-bold">Images Published by Our Team Members</h2>
      </div>
      <div class="relative">
        <main>
          <section v-if="isLoaded">
            <section v-if="images.length === 0" class="notif">
              <p class="text-center">No Images Found</p>
            </section>
            <section v-else class="gallery">
              <article v-for="image in images" :key="image.id">
                <video v-if="image.name.endsWith('.mp4')" controls class="item">
                  <source :src="image.url" />
                </video>
                <img v-else class="item" :src="image.url" :alt="image.name" @click="openModal(image)" />
              </article>
            </section>
          </section>
          <section v-else class="loader">
            <p class="text-center">Loading Images</p>
          </section>
        </main>
        <div class="overlay" v-if="modalImage" @click="closeModal">
          <div class="modal-content" @click.stop>
            <img :src="modalImage.url" :alt="modalImage.name" class="modal-image" />
            <p class="modal-name">{{ modalImage.name }}</p>
            <button class="close-button" @click="closeModal">×</button>
          </div>
        </div>

      </div>
    </div>
    <div class="text-center my-4">
      <input type="file" name="upload" class="hidden" ref="uploadFile" @change="handleFileUpload" />
      <input type="button" value="Upload" class="bg-blue-500 text-white p-3 rounded"
        @click="$refs.uploadFile.click()" />
      <button @click="searchImage" class="bg-blue-500 text-white p-3 rounded mx-3">Search</button>
      <button @click="clearSearch" class="bg-blue-500 text-white p-3 rounded">Clear</button>
      <input type="text" v-model="searchQuery" placeholder="Search by image name" class="border p-3 mx-3" />
    </div>
  </section>
</template>



<script setup>
import { watch } from 'vue';

import layer8 from "layer8_interceptor";
import { onMounted, ref } from 'vue';
import emitter from '@/plugins/mitt';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const isLoaded = ref(false);
const images = ref([]);
const modalImage = ref(null);
const searchQuery = ref('');
const uploadFile = ref(null); // Make uploadFile a ref

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  layer8.fetch(BACKEND_URL + '/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  })
    .then((response) => response.json())
    .then(() => {
      emitter.emit('reload_images');
    });
}

const fetchImages = () => {
  isLoaded.value = false;

  layer8.fetch(BACKEND_URL + '/api/gallery')
    .then((response) => response.json())
    .then(async (data) => {
      var imgs = [];
      for (var i = 0; i < data.data.length; i++) {
        const image = data.data[i];
        const url = await layer8.static(image.url);
        imgs.push({
          id: image.id,
          name: image.name,
          url: url
        });
      }
      images.value = imgs;
      isLoaded.value = true;
    });
}

const searchImage = () => {
  if (!searchQuery.value.trim()) return; // avoid searching with empty strings

  isLoaded.value = false;
  layer8.fetch(`${BACKEND_URL}/api/gallery/${searchQuery.value.trim()}`)
    .then((response) => response.json())
    .then(async (data) => {
      if (!data.data || !data.data.url) {
        images.value = [];
        isLoaded.value = true;
        return;
      }
      var imgs = [];
      const url = await layer8.static(data.data.url);
      imgs.push({
        id: data.data.id,
        name: data.data.name,
        url: url
      });
      images.value = imgs;
      isLoaded.value = true;
    })
    .catch((error) => {
      console.error(error);
      images.value = [];
      isLoaded.value = true;
    });
}

const clearSearch = () => {
  searchQuery.value = ''; // clear the search input
  fetchImages(); // reload all images
}

const openModal = (image) => {
  console.log("Triggered openModal")
  modalImage.value = image;
  console.log("Image:", modalImage.value)
};

const closeModal = () => {
  modalImage.value = null;
};

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  fetchImages();
});

emitter.on('reload_images', () => {
  fetchImages();
});

window.addEventListener('click', (e) => {
  if (e.target === document.querySelector('.modal') && modalImage.value) {
    modalImage.value = null;
  }
});

watch(modalImage, (newValue) => {
  console.log('Modal Image changed:', newValue);
});

</script>

<style scoped>
button:focus {
  outline: none;
}

.flex {
  display: flex;
}

.gallery {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px;
}

.item {
  max-width: 300px;
  height: 180px;
  flex-shrink: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  text-align: center;
}

.modal-image {
  max-width: 100%;
  height: auto;
}

.modal-name {
  margin-top: 10px;
  font-size: 1.2em;
  color: #333;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: #333;
  cursor: pointer;
}
</style>
