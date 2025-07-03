<template>
  <div class="rounded-xl p-8 w-full">
    <div class="flex items-start gap-6 mb-6">
      <div class="text-gray-500">
        <i class="fas fa-user-circle text-[80px]"></i>
      </div>
      <div class="space-y-2">
        <div>
          <label class="block font-semibold">Hobby</label>
          <div>{{ profile.hobbies || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Favorite Sports</label>
          <div>{{ profile.favoriteSports || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Preferred Music</label>
          <div>{{ profile.preferredMusic || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Preferred Movie</label>
          <div>{{ profile.preferredMovie || '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { userData } from '@/stores/profile'

defineProps<{
  profile: userData
}>()
</script>
