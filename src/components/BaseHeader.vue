<template>
  <header
    class="fixed top-0 left-0 w-full h-14 px-4 flex items-center z-50 backdrop-blur-sm justify-between"
  >
    <div class="border border-black px-4 py-1 text-sm bg-white/60 backdrop-blur-sm">LOGO</div>

    <div v-if="auth.isLogin" class="relative p-10" ref="menuRef">
      <button @click="toggleMenu" class="text-2xl">
        <i class="fas fa-bars"></i>
      </button>

      <div
        v-if="showMenu"
        class="absolute bg-white backdrop-blur-sm right-4 w-40 rounded shadow-md z-50"
      >
        <ul class="text-sm">
          <li
            v-for="(item, i) in menuItems"
            :key="i"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-black-200 last:border-none"
            @click="handleMenu(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const showMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const menuItems = [
  { label: 'Home', route: '/home' },
  { label: 'My Profile', route: '/profile' },
  { label: 'Edit Profile', route: '/profile/edit' },
  { label: 'Logout', route: '/login', isLogout: true },
]

const handleMenu = (item: { route: string; isLogout?: boolean }) => {
  showMenu.value = false
  if (item.isLogout) {
    auth.logout()
    router.push('/login')
  } else {
    router.push(item.route)
  }
}
</script>

<style scoped></style>
