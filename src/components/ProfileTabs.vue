<template>
  <ul class="text-sm border-r border-gray-300 w-48">
    <li
      v-for="(tab, index) in visibleTabs"
      :key="index"
      @click="() => emit('select-tab', tab.key)"
      :class="[
        'py-2 px-4 cursor-pointer border-b border-dashed border-gray-400',
        tab.key === modelValue ? 'font-bold border-r-4 border-black' : '',
      ]"
    >
      {{ tab.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'
import { computed } from 'vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select-tab', value: string): void
}>()

const profile = useProfileStore()

const tabs = computed(() => [
  { key: 'basic', label: 'Basic Details', isShow: true },
  { key: 'additional', label: 'Additional Details', isShow: true },
  {
    key: 'spouse',
    label: 'Spouse Details',
    isShow: profile.data.maritalStatus === true,
  },
  { key: 'preferences', label: 'Personal Preferences', isShow: true },
])

const visibleTabs = computed(() => tabs.value.filter((tab) => tab.isShow))
</script>
