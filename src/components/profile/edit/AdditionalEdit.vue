<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { BUTTON_TYPES } from '@/constants'
import { useProfileStore } from '@/stores/profile'
import type { FormField } from '@/types/form'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import * as yup from 'yup'

interface AdditionalFormValues {
  homeAddress: string
  country: string
  postalCode: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
}

const profile = useProfileStore()
const { showToast } = useToastGlobal()

onMounted(() => {
  setValues({
    homeAddress: profile.data.homeAddress,
    country: profile.data.country,
    postalCode: profile.data.postalCode,
    dateOfBirth: profile.data.dateOfBirth,
    gender: profile.data.gender,
    maritalStatus: profile.data.maritalStatus ? 'Married' : 'Single',
  })
})

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
  handleSubmit((formData) => {
    if (btn === BUTTON_TYPES.saveButton) {
      const updatedFormData = {
        ...formData,
        maritalStatus: formData.maritalStatus === 'Married' ? true : false,
      }
      profile.updateProfile(updatedFormData)
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
        <BaseForm :source="additionalForm" :isFormValid="meta.valid" @submit="submit" />
      </div>
    </div>
  </div>
</template>
