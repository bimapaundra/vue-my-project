<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useToastGlobal } from '@/composables/useToastGlobal'
import { BUTTON_TYPES } from '@/constants'
import { useProfileStore } from '@/stores/profile'
import type { FormField } from '@/types/form'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import * as yup from 'yup'

interface SpouseDetailFormValues {
  salutation: string
  firstName: string
  lastName: string
}

const profile = useProfileStore()
const { showToast } = useToastGlobal()

onMounted(() => {
  setValues({
    salutation: profile.data.spouse.salutation,
    firstName: profile.data.spouse.firstName,
    lastName: profile.data.spouse.lastName,
  })
})

const schema = computed(() => {
  return yup.object({
    salutation: yup.string().required('Salutation is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  })
})

const { handleSubmit, meta, setValues } = useForm<SpouseDetailFormValues>({
  validationSchema: schema,
  validateOnMount: false,
})

const spouseDetailForm: FormField[] = [
  {
    name: 'salutation',
    label: 'Salutation',
    type: 'select',
    required: true,
    options: ['Mr', 'Mrs'],
  },
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
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
      profile.updateProfile({
        spouse: formData,
      })
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
        <BaseForm :source="spouseDetailForm" :isFormValid="meta.valid" @submit="submit" />
      </div>
    </div>
  </div>
</template>
