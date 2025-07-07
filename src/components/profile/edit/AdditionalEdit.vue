<script setup lang="ts">
import axios from 'axios'
import BaseForm from '@/components/BaseForm.vue'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { BUTTON_TYPES } from '@/constants'
import type { FormField } from '@/types/form'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { handleAxiosError } from '@/composables/useAxiosError'

interface AdditionalFormValues {
  homeAddress: string
  country: string
  postalCode: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
}

const auth = useAuthStore()
const profileStore = useProfileStore()
const { showToast } = useToastGlobal()

const schema = computed(() => {
  return yup.object({
    homeAddress: yup.string().required('Home address is required'),
    country: yup.string().required('Country is required'),
    postalCode: yup.string().required('Postal code is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    gender: yup.string().required('Gender is required'),
  })
})

const { handleSubmit, meta, setValues } = useForm<AdditionalFormValues>({
  validationSchema: schema,
  validateOnMount: false,
  initialValues: {
    homeAddress: '',
    country: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
  },
})

onMounted(async () => {
  if (!auth.user?.userId) return

  try {
    const res = await axios.get(`/api/profile/${auth.user.userId}`)
    const user = res.data.profile

    setValues({
      homeAddress: user.homeAddress,
      country: user.country,
      postalCode: user.postalCode,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      maritalStatus: user.maritalStatus ? 'Married' : 'Single',
    })

    profileStore.updateProfile(user)
  } catch (err) {
    showToast(handleAxiosError(err), 'error')
  }
})

const additionalForm: FormField[] = [
  { name: 'homeAddress', label: 'Home Address', type: 'text', required: true },
  { name: 'country', label: 'Country', type: 'text', required: true },
  { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
  { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female'] },
  {
    name: 'maritalStatus',
    label: 'Marital Status',
    type: 'select',
    required: true,
    options: ['Married', 'Single'],
  },
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
        const updatedData = {
          ...formData,
          maritalStatus: formData.maritalStatus === 'Married',
        }

        const res = await axios.patch(`/api/profile/${auth.user.userId}`, updatedData)
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
        <BaseForm :source="additionalForm" :isFormValid="meta.valid" @submit="submit" />
      </div>
    </div>
  </div>
</template>
