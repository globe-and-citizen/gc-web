<script setup lang="ts">
import type { NetworkState } from 'layer8-interceptor-rs/layer8_interceptor_rs'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const code = ref(new URLSearchParams(window.location.search).get("code"))
const token = ref(localStorage.getItem("token") || null)

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const { layer8 } = defineProps<{ layer8: NetworkState }>();

onMounted(() => {
    setTimeout(() => {
        layer8.fetch(BACKEND_URL + "/api/login/layer8/auth", {
            method: "POST",
            headers: {
                "Content-Type": "Application/Json"
            },
            body: JSON.stringify({
                callback_url: window.location.href,
            })
        })
            .then((res: Response) => res.json())
            .then((data: { token: string }) => {
                localStorage.setItem("token", data.token)
                router.push({ name: 'hidden' })
            })
            .catch((err: Error) => console.log(err))
    }, 1000);
})
</script>

<template>
    <div>
        <h1>Login with layer8...</h1>
    </div>
</template>