<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BaseForm from '@/components/BaseForm.vue'
import type { FormField } from '@/types/form'
import { BUTTON_TYPES } from '@/constants'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToastGlobal } from '@/composables/useToastGlobal'

const mode = ref<'login' | 'register'>('login')

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToastGlobal()

interface AuthFormValues {
  userId: string
  password: string
  confirmPassword?: string
  remember?: boolean
}

onMounted(() => {
  auth.tryAutoLogin()
  if (auth.checkIsLogin()) {
    router.push('/profile')
  }
})

const schema = computed(() => {
  return mode.value === 'login'
    ? yup.object({
        userId: yup.string().required('User ID is required'),
        password: yup.string().required('Password is required'),
        remember: yup.boolean().default(false),
      })
    : yup.object({
        userId: yup.string().required('User ID is required'),
        password: yup.string().required('Password is required'),
        confirmPassword: yup
          .string()
          .required('Please confirm your password')
          .oneOf([yup.ref('password')], 'Your passwords do not match.'),
      })
})

const { handleSubmit, meta, values, resetForm } = useForm<AuthFormValues>({
  validationSchema: schema,
  validateOnMount: false,
  initialValues: {
    userId: '',
    password: '',
    remember: false,
  },
})

watch(mode, (val) => {
  if (val === 'login') {
    resetForm({
      values: {
        userId: '',
        password: '',
        remember: false,
      },
      errors: {},
      touched: {},
    })
  } else {
    resetForm({
      values: {
        userId: '',
        password: '',
        confirmPassword: '',
      },
      errors: {},
      touched: {},
    })
  }
})

const loginForm: FormField[] = [
  { name: 'userId', label: 'User ID', type: 'text', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  { name: 'remember', label: 'Keep me logged in', type: 'checkbox' },
  {
    name: 'actionButtons',
    label: '',
    type: 'button-group',
    buttons: [
      { name: 'login', label: 'LOGIN', customButton: BUTTON_TYPES.loginButton, mustValidate: true },
    ],
  },
]

const registerForm: FormField[] = [
  { name: 'userId', label: 'User ID', type: 'text', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  { name: 'confirmPassword', label: 'Confirm password', type: 'password', required: true },
  {
    name: 'actionButtons',
    label: '',
    type: 'button-group',
    buttons: [
      {
        name: 'register',
        label: 'REGISTER',
        customButton: BUTTON_TYPES.saveButton,
        mustValidate: true,
      },
    ],
  },
]

const handleAuthSubmit = (btn: string) => {
  handleSubmit(() => {
    if (mode.value === 'login' && btn === 'login') {
      const success = auth.login(values.userId, values.password, values.remember)
      if (success) {
        showToast('Login berhasil!', 'success')
        router.push('/profile')
      } else {
        showToast('User ID and/or password does not match.', 'error')
      }
    } else if (mode.value === 'register' && btn === 'register') {
      showToast('Register berhasil!', 'success')
      router.push('/profile')
    }
  })()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-light leading-snug">
          Welcome to <span class="font-bold text-black">myApp</span>
        </h1>
        <div class="mx-auto mt-2 w-16 border-t-2 border-black"></div>
      </div>

      <BaseForm
        :source="mode === 'login' ? loginForm : registerForm"
        :isFormValid="meta.valid"
        @submit="handleAuthSubmit"
      />

      <div class="text-sm mt-8 text-center">
        <template v-if="mode === 'login'">
          No account?
          <button class="underline" @click="mode = 'register'">Register here</button>
        </template>
        <template v-else>
          Already have an account?
          <button class="underline" @click="mode = 'login'">Back to login</button>
        </template>
      </div>
    </div>
  </div>
</template>
