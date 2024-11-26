import { ref } from 'vue';
import layer8_interceptor from 'layer8_interceptor';

export function useFetchMusic({ endpoint }: { endpoint: string }) {
  const musicFile = ref<{ id: number; name: string; url: string } | null>(null);

  const fetchMusic = async () => {
    try {
      const res = await layer8_interceptor.fetch(endpoint, { method: 'GET' });
      const data = await res.json();

      const track = data.data;

      const url = await layer8_interceptor.static(track.url);

      musicFile.value = {
        id: track.id,
        name: track.name,
        url: url,
      };
    } catch (err) {
      console.error('Error fetching music:', err);
    }
  };

  return { musicFile, fetchMusic };
}
