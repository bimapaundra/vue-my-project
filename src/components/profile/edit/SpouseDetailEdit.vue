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

interface SpouseDetailFormValues {
  salutation: string
  firstName: string
  lastName: string
}

const auth = useAuthStore()
const profileStore = useProfileStore()
const { showToast } = useToastGlobal()

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
  initialValues: {
    salutation: '',
    firstName: '',
    lastName: '',
  },
})

onMounted(async () => {
  if (!auth.user?.userId) return

  try {
    const res = await axios.get(`/api/profile/${auth.user.userId}`)
    const user = res.data.profile

    setValues({
      salutation: user.spouse.salutation,
      firstName: user.spouse.firstName,
      lastName: user.spouse.lastName,
    })

    profileStore.updateProfile(user)
  } catch (err) {
    showToast(handleAxiosError(err), 'error')
  }
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
  handleSubmit(async (formData) => {
    if (btn === BUTTON_TYPES.saveButton && auth.user?.userId) {
      try {
        const res = await axios.patch(`/api/profile/${auth.user.userId}`, {
          spouse: formData,
        })

        profileStore.updateProfile(res.data.profile)
        showToast('Spouse details updated successfully!', 'success')
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
        <BaseForm :source="spouseDetailForm" :isFormValid="meta.valid" @submit="submit" />
      </div>
    </div>
  </div>
</template>
