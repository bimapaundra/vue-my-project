<script setup lang="ts">
import { toastMessage, toastType } from '@/composables/useToastGlobal'
import { ref, watch, computed } from 'vue'

const isVisible = ref(false)
let timeout: ReturnType<typeof setTimeout>

watch(toastMessage, (msg) => {
  if (msg) {
    isVisible.value = true

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      isVisible.value = false
      toastMessage.value = ''
    }, 3000)
  }
})

const close = () => {
  isVisible.value = false
  toastMessage.value = ''
  clearTimeout(timeout)
}

const typeClass = computed(() => {
  switch (toastType.value) {
    case 'error':
      return 'bg-red-500'
    case 'success':
      return 'bg-green-500'
    case 'info':
      return 'bg-blue-500'
    case 'warning':
      return 'bg-yellow-500 text-black'
    default:
      return 'bg-gray-600'
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-md text-white',
      typeClass,
    ]"
  >
    <span>{{ toastMessage }}</span>
    <button @click="close" class="absolute top-1.5 right-2 text-white text-sm hover:text-gray-200">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>
