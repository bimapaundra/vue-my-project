<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { BUTTON_TYPES } from '@/constants'
import { useProfileStore } from '@/stores/profile'
import type { FormField } from '@/types/form'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import * as yup from 'yup'

interface PersonalPreferenceFormValues {
  hobbies: string
  favoriteSports: string
  preferredMusic: string
  preferredMovie: string
}

const profile = useProfileStore()
const { showToast } = useToastGlobal()

onMounted(() => {
  setValues({
    hobbies: profile.data.hobbies,
    favoriteSports: profile.data.favoriteSports,
    preferredMusic: profile.data.preferredMusic,
    preferredMovie: profile.data.preferredMovie,
  })
})

const schema = computed(() => {
  return yup.object({
    hobbies: yup.string().required('Hobbies is required'),
    favoriteSports: yup.string().required('Favorite Sports is required'),
    preferredMusic: yup.string().required('Prefered Music is required'),
    preferredMovie: yup.string().required('Prefered Movie is required'),
  })
})

const { handleSubmit, meta, setValues } = useForm<PersonalPreferenceFormValues>({
  validationSchema: schema,
  validateOnMount: false,
})

const personalPreferenceForm: FormField[] = [
  {
    name: 'hobbies',
    label: 'Hobbies',
    type: 'text',
    required: true,
  },
  { name: 'favoriteSports', label: 'Favorite Sports', type: 'text', required: true },
  { name: 'preferredMusic', label: 'Prefered Music', type: 'text', required: true },
  { name: 'preferredMovie', label: 'Prefered Movie', type: 'text', required: true },
  {
    name: 'actionButtons',
    label: '',
    type: 'button-group',
    buttons: [
      {
        name: BUTTON_TYPES.saveButton,
        label: 'Save & Update',
        customButton: BUTTON_TYPES.saveButton,
        mustValidate: true,
      },
    ],
  },
]

const submit = (btn: string) => {
  handleSubmit((formData) => {
    if (btn === BUTTON_TYPES.saveButton) {
      profile.updateProfile(formData)
      showToast('Update profile berhasil!', 'success')
    }
  })()
}
</script>

<template>
  <div class="rounded-xl p-8 w-full">
    <div class="flex items-start gap-6 mb-6">
      <div class="text-gray-500">
        <i class="fas fa-user-circle text-[80px]"></i>
      </div>
      <div class="space-y-2">
        <BaseForm :source="personalPreferenceForm" :isFormValid="meta.valid" @submit="submit" />
      </div>
    </div>
  </div>
</template>
