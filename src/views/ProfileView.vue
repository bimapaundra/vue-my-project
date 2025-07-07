<template>
  <div class="pt-[72px] px-4 sm:px-6 md:px-12 lg:px-20 min-h-screen">
    <!-- Mobile Sidebar Trigger -->
    <div class="sm:hidden flex items-center justify-start gap-2 mb-4">
      <button @click="isDrawerOpen = true" class="text-xl">
        <i class="fas fa-angle-right"></i>
      </button>
    </div>

    <transition name="slide">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-start"
        @click.self="isDrawerOpen = false"
      >
        <div class="bg-white w-64 h-full shadow-lg pt-[72px]">
          <div class="flex justify-between items-center px-4 mb-4">
            <h3 class="text-base font-semibold">Profile Tabs</h3>
            <button @click="isDrawerOpen = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="px-4">
            <ProfileTabs
              v-model="activeTab"
              @select-tab="
                (tab) => {
                  isDrawerOpen = false
                  onTabChange(tab)
                }
              "
            />
          </div>
        </div>
      </div>
    </transition>

    <div class="w-full max-w-7xl mx-auto relative flex gap-8 min-h-screen">
      <!-- Desktop Sidebar Tabs -->
      <div class="hidden sm:block w-64 shrink-0 sticky top-[220px] self-start">
        <ProfileTabs v-model="activeTab" @select-tab="onTabChange" />
      </div>

      <div class="flex-1 flex justify-center sm:justify-start">
        <div class="w-full max-w-4xl">
          <PageTitle class="mb-6" prefix="My" title="Profile">
            <template #action>
              <router-link to="/profile/edit" class="text-sm underline flex items-center gap-1">
                Edit profile <i class="fas fa-pen"></i>
              </router-link>
            </template>
          </PageTitle>

          <div v-if="activeTab === 'basic'">
            <BasicProfileInfo :profile="profile.data" />
          </div>
          <div v-else-if="activeTab === 'additional'">
            <AdditionalInfo :profile="profile.data" />
          </div>
          <div v-else-if="activeTab === 'spouse'">
            <SpouseDetailsInfo :profile="profile.data" />
          </div>
          <div v-else-if="activeTab === 'preferences'">
            <PersonalPreferenceInfo :profile="profile.data" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileTabs from '@/components/ProfileTabs.vue'
import PageTitle from '@/components/PageTitle.vue'
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import BasicProfileInfo from '@/components/profile/view/BasicProfileInfo.vue'
import AdditionalInfo from '@/components/profile/view/AdditionalInfo.vue'
import SpouseDetailsInfo from '@/components/profile/view/SpouseDetailsInfo.vue'
import PersonalPreferenceInfo from '@/components/profile/view/PersonalPreferenceInfo.vue'

const profile = useProfileStore()

const activeTab = ref('basic')
const isDrawerOpen = ref(false)
const onTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>
