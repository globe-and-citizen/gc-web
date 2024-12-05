import wasm from 'vite-plugin-wasm';

export default defineNuxtConfig({
    vite: {
        plugins: [wasm()],
    },
});