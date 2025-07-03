<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { BUTTON_TYPES } from '@/constants'
import { useProfileStore } from '@/stores/profile'
import type { FormField } from '@/types/form'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import * as yup from 'yup'

interface BasicProfileFormValues {
  salutation: string
  firstName: string
  lastName: string
  email: string
}

const profile = useProfileStore()
const { showToast } = useToastGlobal()

onMounted(() => {
  setValues({
    salutation: profile.data.salutation,
    firstName: profile.data.firstName,
    lastName: profile.data.lastName,
    email: profile.data.email,
  })
})

const schema = computed(() => {
  return yup.object({
    salutation: yup.string().required('Salutation is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
  })
})

const { handleSubmit, meta, setValues } = useForm<BasicProfileFormValues>({
  validationSchema: schema,
  validateOnMount: false,
  initialValues: {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
  },
})

const basicProfileForm: FormField[] = [
  {
    name: 'salutation',
    label: 'Salutation',
    type: 'select',
    required: true,
    options: ['Mr', 'Mrs'],
  },
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
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
        <BaseForm :source="basicProfileForm" :isFormValid="meta.valid" @submit="submit" />
      </div>
    </div>
  </div>
</template>
