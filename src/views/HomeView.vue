<script setup lang="ts">
import layer8 from 'layer8_interceptor'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import layer8_interceptor from 'layer8_interceptor'

import FooterComponent from '@/components/FooterComponent.vue'
import NavBarComponent from '@/components/NavBarComponent.vue'
import HeroComponent from '@/components/HeroComponent.vue'
import TeamComponent from '@/components/TeamComponent.vue'
import TimelineComponent from '@/components/TimelineComponent.vue'
import AboutComponent from '@/components/AboutComponent.vue'
import BlogSection from '@/components/BlogSection.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const router = useRouter()

const loginWithLayer8Popup = async () => {
  const response = await layer8.fetch(BACKEND_URL + "/api/login/layer8/auth")
  const data = await response.json()
  const popup = window.open(data.authURL, "Login with Layer8", "width=600,height=600") as Window;

  window.addEventListener("message", async (event) => {
    if (event.data.redr) {
      setTimeout(() => {
        layer8.fetch(BACKEND_URL + "/api/login/layer8/auth", {
          method: "POST",
          headers: {
            "Content-Type": "Application/Json"
          },
          body: JSON.stringify({
            callback_url: event.data.redr,
          })
        })
          .then(res => res.json())
          .then(data => {
            localStorage.setItem("L8_TOKEN", data.token)
            router.push({ name: 'imaginary-world' })
            popup.close();
          })
          .catch(err => console.log(err))
      }, 1000);
    }
  });
}

const handleJourneyStarted = () => {
  loginWithLayer8Popup()
}


declare global {
  interface Window {
    startImaginaryWorld?: () => void
  }
}

// Attach the function to the window object when the component is mounted
onMounted(() => {
  window.startImaginaryWorld = loginWithLayer8Popup
})


const images:any = ref([]);
const isLoaded = ref(false);

const uploadFile = (e:any) => {
  console.log("File Upload...")
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  layer8.fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  })
    .then((response) => response.json())
    .catch(err=>{
      console.log(err)
    })
}


const fetchImages = () => {
  isLoaded.value = false;
  console.log("fetchImages has run...")

  layer8_interceptor.fetch(BACKEND_URL +'/api/gallery-one', {
    method: "GET"
  }).then( async (res) => {
    let json = await res.json()
    console.log("Fom '/api/gallery-one': ", json)
    return json
  }).then(async (data: any) => {
      var imgs = []; 
      for (var i = 0; i < data.data.length; i++) {
        const image = data.data[i];
        const url = await layer8_interceptor.static(image.url);
        imgs.push({
          id: image.id,
          name: image.name,
          url: url
        });
      }
      images.value = imgs;
      isLoaded.value = true;
    })
    .catch((err: any) => {
      console.log(err)
    });
}

setTimeout(async () => {  
  fetchImages()
  let url = await layer8_interceptor.static("http://localhost:3000/media/Chess.jpg");
  const pictureBox = document.getElementById("pictureBox");
  console.log("url: ", url)
  if (pictureBox != null){
    pictureBox.src = url;
  }
  
}, 500)


</script>

<template>
  <main class="h-full flex flex-col justify-between">
    <header>
    <h1>ImSharer</h1>
    <input type="file" name="upload" ref="uploadFile" @change="uploadFile" />
  </header>
    <div> 
      <hr>
      <img id="pictureBox">
      <hr>
    </div>
    <section v-if="isLoaded">
      <section v-if="images.length === 0" class="notif">
        <p>No Images Found</p>
      </section>
      <section v-else class="gallery">
        <article v-for="image in images" :key="image.id">
          <img :src="image.url" :alt="image.name" />
          <p>{{ image.url }}</p>
        </article>
      </section>
    </section>
    <div>
      <NavBarComponent></NavBarComponent>
      <HeroComponent @journey-started="handleJourneyStarted" />
      <AboutComponent />
      <TeamComponent />
      <TimelineComponent />
      <BlogSection />
    </div>
    <FooterComponent></FooterComponent>
  </main>
</template>

<style lang="scss"></style>
