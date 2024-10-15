<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBarComponent from '@/components/NavBarComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { initializeApp } from "firebase/app";
import { getFirestore, type DocumentData } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});
const db = getFirestore(app);

const subject = ref('')
const content = ref('')

const submit = async () => {
  try {
    const docRef = await addDoc(collection(db, "feedbacks"), {
      subject: subject.value,
      content: content.value
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const feedbacks = ref<DocumentData[]>([]);
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "feedbacks"));
  querySnapshot.forEach((doc) => {
    feedbacks.value.push(doc.data());
  });
})
</script>

<template>
  <main class="h-full flex flex-col justify-between">
      <NavBarComponent />
      <div class="container mx-auto py-20">
        <h2 class="text-5xl font-bold text-center">Feedbacks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div v-for="feedback in feedbacks" :key="feedback.id" class="bg-gray-100 p-4 rounded-lg my-2">
            <h3 class="text-xl font-bold">{{ feedback.subject }}</h3>
            <p>{{ feedback.content }}</p>
          </div>
          <div v-if="feedbacks.length === 0" class="text-center col-span-3">
            <p>No feedbacks yet.</p>
          </div>
        </div>
      </div>
      <section id="feedback" class="bg-black text-white py-20">
        <div class="container mx-auto">
          <p class="text-center lg:w-2/3 mx-auto py-8">
            We are always looking for feedback to improve our platform. Please let us know what you think!
          </p>
          <form @submit.prevent="submit">
            <div class="flex flex-col lg:flex-row justify-center gap-4">
              <input
                type="text"
                class="w-full lg:w-1/2 p-4 rounded-lg bg-gray-800 text-white"
                placeholder="Subject"
                v-model="subject"
                required
              />
            </div>
            <div class="flex flex-col lg:flex-row justify-center gap-4 mt-2">
              <textarea
                class="w-full lg:w-1/2 h-40 p-4 rounded-lg bg-gray-800 text-white"
                placeholder="Enter your feedback here..."
                v-model="content"
                required
              ></textarea>
            </div>
            <div class="flex justify-center mt-4">
              <button class="bg-white hover:bg-gray-200 text-black font-bold py-2 px-10" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
      <FooterComponent />
  </main>
</template>
