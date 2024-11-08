import { ref } from 'vue';
import layer8_interceptor from 'layer8_interceptor';
import eventBus from '@/utils/eventBus';
import { stopRainingEffect } from '@/utils/codeRainingEffect'

export function useFetchImages({ endpoint }: { endpoint: string }) {
  const isLoaded = ref(false);
  const images = ref<any[]>([]);
  const loadingPercentage = ref(0);

  const fetchImages = async () => {
    try {
      const res = await layer8_interceptor.fetch(endpoint, { method: "GET" });
      const data = await res.json();

      const totalImages = data.data.length;
      const imgs: any[] = [];

      for (let i = 0; i < totalImages; i++) {
        const image = data.data[i];

        const url = await layer8_interceptor.static(image.url);

        imgs.push({
          id: image.id,
          name: image.name,
          url: url
        });

        loadingPercentage.value = Math.round(((i + 1) / totalImages) * 100);

        eventBus.emit('loading-percentage', loadingPercentage.value);
      }

      images.value = imgs;
      isLoaded.value = true;
      setTimeout(() => {stopRainingEffect()}, 1000)
    } catch (err) {
      console.error("Error fetching images:", err);
      isLoaded.value = false;
      stopRainingEffect()
    }
  };

  return { isLoaded, images, fetchImages };
}
