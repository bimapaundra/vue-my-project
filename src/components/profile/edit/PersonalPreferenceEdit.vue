<script setup lang="ts">
import axios from 'axios'
import BaseForm from '@/components/BaseForm.vue'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { BUTTON_TYPES } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import type { FormField } from '@/types/form'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import * as yup from 'yup'
import { handleAxiosError } from '@/composables/useAxiosError'

interface PersonalPreferenceFormValues {
  hobbies: string
  favoriteSports: string
  preferredMusic: string
  preferredMovie: string
}

const auth = useAuthStore()
const profileStore = useProfileStore()
const { showToast } = useToastGlobal()

const schema = computed(() => {
  return yup.object({
    hobbies: yup.string().required('Hobbies is required'),
    favoriteSports: yup.string().required('Favorite sports is required'),
    preferredMusic: yup.string().required('Preferred music is required'),
    preferredMovie: yup.string().required('Preferred movie is required'),
  })
})

const { handleSubmit, meta, setValues } = useForm<PersonalPreferenceFormValues>({
  validationSchema: schema,
  validateOnMount: false,
  initialValues: {
    hobbies: '',
    favoriteSports: '',
    preferredMusic: '',
    preferredMovie: '',
  },
})

onMounted(async () => {
  if (!auth.user?.userId) return

  try {
    const res = await axios.get(`/api/profile/${auth.user.userId}`)
    const user = res.data.profile

    setValues({
      hobbies: user.hobbies,
      favoriteSports: user.favoriteSports,
      preferredMusic: user.preferredMusic,
      preferredMovie: user.preferredMovie,
    })

    profileStore.updateProfile(user)
  } catch (err) {
    showToast(handleAxiosError(err), 'error')
  }
})

const personalPreferenceForm: FormField[] = [
  { name: 'hobbies', label: 'Hobbies', type: 'text', required: true },
  { name: 'favoriteSports', label: 'Favorite Sports', type: 'text', required: true },
  { name: 'preferredMusic', label: 'Preferred Music', type: 'text', required: true },
  { name: 'preferredMovie', label: 'Preferred Movie', type: 'text', required: true },
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
  handleSubmit(async (formData) => {
    if (btn === BUTTON_TYPES.saveButton && auth.user?.userId) {
      try {
        const res = await axios.patch(`/api/profile/${auth.user.userId}`, formData)
        profileStore.updateProfile(res.data.profile)

        showToast('Profile updated successfully!', 'success')
      } catch (err) {
        showToast(handleAxiosError(err), 'error')
      }
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
