<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import layer8_interceptor from 'layer8-interceptor-rs'
import * as layer8_interceptor from 'layer8-interceptor-rs'

const router = useRouter()
const code = ref(new URLSearchParams(window.location.search).get("code"))
const token = ref(localStorage.getItem("token") || null)
const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL

onMounted(() => {
    setTimeout(() => {
        layer8_interceptor.fetch(BACKEND_URL + "/api/login/layer8/auth", {
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