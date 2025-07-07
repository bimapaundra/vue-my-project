<template>
  <div class="rounded-xl p-8 w-full">
    <div class="flex items-start gap-6 mb-6">
      <div class="text-gray-500">
        <i class="fas fa-user-circle text-[80px]"></i>
      </div>
      <div class="space-y-2">
        <div>
          <label class="block font-semibold">Salutation</label>
          <div>{{ profile?.spouse.salutation || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">First Name</label>
          <div>{{ profile?.spouse.firstName || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Last Name</label>
          <div>{{ profile?.spouse.lastName || '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { userData } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { handleAxiosError } from '@/composables/useAxiosError'

const auth = useAuthStore()
const { showToast } = useToastGlobal()
const profile = ref<userData | null>(null)

onMounted(async () => {
  if (!auth.user?.userId) return

  try {
    const res = await axios.get(`/api/profile/${auth.user.userId}`)
    profile.value = res.data.profile
  } catch (err) {
    showToast(handleAxiosError(err), 'error')
  }
})
</script>
