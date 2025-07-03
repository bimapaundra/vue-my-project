<template>
  <div class="pt-[72px] px-4 sm:px-6 md:px-12 lg:px-20 min-h-screen">
    <div class="w-full max-w-7xl mx-auto relative flex gap-8 min-h-screen">
      <!-- Desktop Sidebar Tabs -->
      <div class="hidden md:block w-64 shrink-0 sticky top-[220px] self-start">
        <ProfileTabs v-model="activeTab" @select-tab="onTabChange" />
      </div>

      <!-- Mobile Tabs -->
      <div class="block md:hidden mb-4 overflow-x-auto">
        <div class="flex gap-2 border-b">
          <button
            v-for="tab in visibleTabs"
            :key="tab.key"
            @click="onTabChange(tab.key)"
            class="px-4 py-2 whitespace-nowrap text-sm border-b-2"
            :class="
              tab.key === activeTab ? 'font-bold border-black' : 'border-transparent text-gray-500'
            "
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="flex-1">
        <div class="max-w-4xl">
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

const visibleTabs = [
  { key: 'basic', label: 'Basic Details' },
  { key: 'additional', label: 'Additional Details' },
  ...(profile.data.maritalStatus ? [{ key: 'spouse', label: 'Spouse Details' }] : []),
  { key: 'preferences', label: 'Personal Preferences' },
]

const activeTab = ref('basic')
const onTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>
