<template>
  <div class="rounded-xl p-8 w-full">
    <div class="flex items-start gap-6 mb-6">
      <div class="text-gray-500">
        <i class="fas fa-user-circle text-[80px]"></i>
      </div>
      <div class="space-y-2">
        <div>
          <label class="block font-semibold">Home Address</label>
          <div>{{ profile.homeAddress || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Country</label>
          <div>{{ profile.country || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Postal Code</label>
          <div>{{ profile.postalCode || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Date of Birth</label>
          <div>{{ profile.dateOfBirth || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Gender</label>
          <div>{{ profile.gender || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Marital Status</label>
          <div>{{ profile.maritalStatus ? 'Married' : 'Single' }}</div>
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
