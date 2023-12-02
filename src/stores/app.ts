import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const isCalled = ref(false)
  function call() {
    isCalled.value=true
  }

  return { isCalled, call }
})
