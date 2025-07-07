<template>
  <div class="rounded-xl p-8 w-full">
    <div class="flex items-start gap-6 mb-6">
      <div class="text-gray-500">
        <i class="fas fa-user-circle text-[80px]"></i>
      </div>
      <div class="space-y-2">
        <div>
          <label class="block font-semibold">Hobby</label>
          <div>{{ profile?.hobbies || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Favorite Sports</label>
          <div>{{ profile?.favoriteSports || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Preferred Music</label>
          <div>{{ profile?.preferredMusic || '-' }}</div>
        </div>
        <div>
          <label class="block font-semibold">Preferred Movie</label>
          <div>{{ profile?.preferredMovie || '-' }}</div>
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
