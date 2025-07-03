<template>
  <div class="rounded-xl p-8 w-full">
    <div class="flex items-start gap-6 mb-6">
      <div class="text-gray-500">
        <i class="fas fa-user-circle text-[80px]"></i>
      </div>
      <div class="space-y-2">
        <div>
          <label class="block font-semibold">Salutation</label>
          <div>{{ profile.spouse.salutation || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">First Name</label>
          <div>{{ profile.spouse.firstName || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Last Name</label>
          <div>{{ profile.spouse.lastName || '-' }}</div>
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
