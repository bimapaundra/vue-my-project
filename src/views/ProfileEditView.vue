<template>
  <div class="pt-[72px] px-6 sm:px-12 md:px-20 min-h-screen">
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
      <div class="hidden sm:block w-64 shrink-0 sticky top-[220px] self-start">
        <ProfileTabs v-model="activeTab" @select-tab="onTabChange" />
      </div>

      <div class="flex-1 flex justify-center sm:justify-start">
        <div class="w-full max-w-4xl">
          <PageTitle class="mb-6" prefix="Edit" title="Profile">
            <template #action>
              <router-link to="/profile" class="text-sm underline flex items-center gap-1">
                <i class="fas fa-angle-left"></i> Go back to my profile
              </router-link>
            </template>
          </PageTitle>

          <div v-if="activeTab === 'basic'">
            <BasicProfileEdit />
          </div>
          <div v-else-if="activeTab === 'additional'">
            <AdditionalEdit />
          </div>
          <div v-else-if="activeTab === 'spouse'">
            <SpouseDetailEdit />
          </div>
          <div v-else-if="activeTab === 'preferences'">
            <PersonalPreferenceEdit />
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
import BasicProfileEdit from '@/components/profile/edit/BasicProfileEdit.vue'
import AdditionalEdit from '@/components/profile/edit/AdditionalEdit.vue'
import SpouseDetailEdit from '@/components/profile/edit/SpouseDetailEdit.vue'
import PersonalPreferenceEdit from '@/components/profile/edit/PersonalPreferenceEdit.vue'

const activeTab = ref('basic')
const isDrawerOpen = ref(false)
const onTabChange = (tab: string) => {
  activeTab.value = tab
}
</script>
