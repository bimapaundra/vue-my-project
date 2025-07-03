<template>
  <div class="flex items-end justify-between mb-6">
    <h2 class="text-2xl sm:text-3xl font-light whitespace-nowrap">
      {{ prefix }} <span class="font-bold">{{ title }}</span>
    </h2>

    <div class="flex-grow border-t-2 border-black mb-[2px] mx-4"></div>

    <div class="flex-shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  prefix?: string
  title: string
}>()
</script>

<script lang="ts">
export default {
  name: 'PageTitle',
}
</script>
