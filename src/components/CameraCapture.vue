<template>
  <div class="container mx-auto border-b-2 border-black">
    <q-card>
      <q-card-section class="row items-center">
        <div class="full-width column items-center justify-center">
          <div class="container px-5 py-16 mx-auto">
            <div class="flex flex-col text-center w-full">
              <h2 class="text-5xl font-bold">Capture, Upload & Download Using Layer8</h2>
            </div>
          </div>
          <div class="web-cam-taker relative-position">
            <video v-if="!is_taken" ref="videoRef" width="25%" height="25%" :style="{ borderRadius: '6px' }" autoplay />

            <canvas v-show="is_taken" id="photoTaken" ref="canvasRef" :style="{ borderRadius: '6px' }"></canvas>

            <div class="absolute-top" :class="{ 'bg-white': is_shooting }" />

            <div v-if="images.length > 0 && isLoaded" class="image-preview ml-3">
              <img :src="images[0].url" :alt="images[0].name" style="border-radius: 6px; width: 100%; height: 100%;" />
            </div>

            <q-spinner v-if="is_loading" color="grey-lighten-4" />

          </div>
          <div class="text-center my-8">
            <q-btn v-if="is_granted" class="bg-blue-500 text-white p-3 rounded mx-3" @click="takePhoto">
              {{ is_taken ? 'Retake' : 'Capture' }}
            </q-btn>
            <q-btn v-if="is_granted" class="bg-blue-500 text-white p-3 rounded mx-3" @click="handleFileUpload">
              Upload
            </q-btn>
            <q-btn class="bg-blue-500 text-white p-3 rounded mx-3 mt-2" @click="downloadImage">
              Download
            </q-btn>
          </div>
          <q-select outlined v-model="selectedDevice" :options="devices" option-label="label" option-value="deviceId"
            class="q-mt-md" dense @update:modelValue="changeCameraStream" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn :disable="!is_taken" flat label="Done" color="primary" v-close-popup @click="submit" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// import layer8 from "layer8-interceptor-rs";
import * as layer8 from 'layer8-interceptor-rs';
import { shallowRef, ref, onBeforeUnmount, nextTick, onMounted, triggerRef } from 'vue'
import { requestAndGetUserMedia } from '../utils/media'
import mitt from 'mitt';
const emitter = mitt();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const emit = defineEmits(['onCapture', 'onErrorCaptured'])

const props = defineProps({
  externalStream: {
    type: Object,
    default: null
  }
})

const is_taken = shallowRef(false)
const is_shooting = shallowRef(false)
const is_loading = shallowRef(false)
const is_granted = shallowRef(false)
const devices = shallowRef<MediaDeviceInfo[]>([]);
const selectedDevice = shallowRef()
const videoRef = ref<any>({ srcObject: null });
// const canvasRef = ref(null)
const canvasRef = ref<HTMLCanvasElement | any>(null);
let capturedFile: File | null = null;
interface Image {
  id: string;
  name: string;
  url: string;
}
const images = ref<Image[]>([]);
const isLoaded = ref(false);

onMounted(async () => {
  await intiateCameraWithPermissions()
  await getDevices()
  await new Promise((resolve) => setTimeout(resolve, 1000));
  fetchImages();
})

emitter.on('reload_images', () => {
  fetchImages();
  is_taken.value = false
  intiateCameraWithPermissions()
});

onBeforeUnmount(() => {
  stopCameraStream()
})

async function getDevices() {
  const allDevices = await navigator.mediaDevices.enumerateDevices()
  devices.value = allDevices.filter((device) => device.kind === 'videoinput')
  selectedDevice.value = devices.value[0]
}

async function intiateCameraWithPermissions() {
  is_loading.value = true

  if (props.externalStream) {
    setCameraStream(props.externalStream)
    is_granted.value = true
  } else {
    const { success, stream } = await requestAndGetUserMedia({
      video: selectedDevice.value
        ? {
          deviceId: selectedDevice.value.deviceId
        }
        : true
    })
    if (success) {
      setCameraStream(stream)
    } else {
      emit('onErrorCaptured')
    }
    is_granted.value = success
  }
  is_loading.value = false
}

async function changeCameraStream(device: any) {
  stopCameraStream()
  const { success, stream } = await requestAndGetUserMedia({
    video: {
      deviceId: device.deviceId
    }
  })

  if (success) {
    setCameraStream(stream)
  } else {
    emit('onErrorCaptured')
  }
}

function setCameraStream(stream: any) {
  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      triggerRef(videoRef)
    }
  })
}

function stopCameraStream() {
  const tracks = videoRef.value?.srcObject?.getTracks()

  tracks?.forEach?.((track: any) => {
    track.stop()
  })
}

function takePhoto() {
  if (!is_taken.value) {
    canvasRef.value.width = videoRef.value.offsetWidth
    canvasRef.value.height = videoRef.value.offsetHeight
    is_shooting.value = true

    const FLASH_TIMEOUT = 50

    setTimeout(() => {
      is_shooting.value = false
    }, FLASH_TIMEOUT)
    is_taken.value = true

    const context = canvasRef.value.getContext('2d')
    context.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height)

    canvasRef.value.toBlob((blob: any) => {
      if (blob) {
        const fileName = `photo_${new Date().toISOString()}.png`
        capturedFile = new File([blob], fileName, { type: blob.type })
      }
    }, 'image/png')

    stopCameraStream()
  } else {
    is_taken.value = false
    intiateCameraWithPermissions()
  }
}

function submit() {
  if (capturedFile) {
    emit('onCapture', capturedFile)
  }
}

const handleFileUpload = (e: any) => {
  if (capturedFile) {
    const formData = new FormData();
    formData.append('file', capturedFile);

    layer8.fetch(BACKEND_URL + '/api/camera/clear', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    layer8.fetch(BACKEND_URL + '/api/camera/upload', {
      method: 'POST',
      // Do not set 'Content-Type' here; 
      // the browser will set the correct boundary and Content-Type for FormData
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        emitter.emit('reload_images');
      });
  } else {
    // Handle cases where capturedFile is null, maybe show an error message
    console.error('No file available to upload');
  }
};


// const handleFileUpload = (e: any) => {
//   const file = capturedFile;
//   const formData = new FormData();
//   formData.append('file', file);

//   layer8.fetch(BACKEND_URL + '/api/camera/clear', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })

//   layer8.fetch(BACKEND_URL + '/api/camera/upload', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     },
//     body: formData
//   })
//     .then((response) => response.json())
//     .then(() => {
//       emitter.emit('reload_images');
//     });
// }

const fetchImages = () => {
  isLoaded.value = false;

  layer8.fetch(BACKEND_URL + '/api/camera/gallery', null)
    .then((response) => response.json())
    .then(async (data) => {
      if (data.data.length > 0) {
        const image = data.data[0]; // Get the first image only
        const url = await layer8._static(image.url);
        images.value = [{
          id: image.id,
          name: image.name,
          url: url
        }];
      }
      isLoaded.value = true;
    });
}

function downloadImage() {
  if (images.value.length > 0) {
    const link = document.createElement('a');
    link.href = images.value[0].url;
    link.download = images.value[0].name || 'downloaded_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

</script>

<style scoped>
.web-cam-taker {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.absolute-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  z-index: 10;
}

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

.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
}
</style>
