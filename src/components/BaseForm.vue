<template>
  <form class="space-y-4">
    <div
      v-for="field in source"
      :key="field.name"
      class="grid gap-y-3 gap-x-2 grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)] items-center"
    >
      <template v-if="field.type === 'checkbox'">
        <div></div>
        <label class="flex items-center gap-2 text-sm">
          <Field
            :id="field.name"
            :name="field.name"
            :value="true"
            type="checkbox"
            as="input"
            class="mr-2"
          />
          {{ field.label }}
        </label>
      </template>

      <template v-else-if="field.type === 'button-group'">
        <label></label>
        <div class="flex gap-3 justify-center sm:justify-start">
          <button
            v-for="btn in field.buttons"
            :disabled="btn.mustValidate && !props.isFormValid"
            :key="btn.name"
            type="button"
            :class="btn.customButton ? buttonClass(btn.customButton) : ''"
            @click="
              () => {
                emit('submit', btn.name)
              }
            "
          >
            {{ btn.label }}
          </button>
        </div>
      </template>

      <template v-else>
        <label
          :for="field.name"
          class="text-sm font-medium text-gray-800 sm:text-right"
          :class="{ 'required-label': field.required }"
        >
          {{ field.label }}
        </label>

        <template v-if="['text', 'email', 'password', 'date'].includes(field.type)">
          <div class="relative w-full">
            <Field
              :id="field.name"
              :name="field.name"
              v-model="values[field.name]"
              :type="isPasswordVisible[field.name] ? 'text' : field.type"
              as="input"
              :class="[
                'w-full border border-black px-3 py-2 bg-white/60 backdrop-blur-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400',
                errors[field.name] ? 'border-red-500' : '',
              ]"
            />

            <button
              v-if="field.type === 'password'"
              type="button"
              @click="togglePasswordVisibility(field.name)"
              class="absolute right-2 top-1/2 -translate-y-[52%] text-gray-600"
            >
              <i :class="isPasswordVisible[field.name] ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>

            <ErrorMessage :name="field.name" class="text-sm text-red-500 mt-1 block" />
          </div>
        </template>
        <template v-else-if="field.type === 'select'">
          <Field
            :name="field.name"
            as="select"
            v-model="values[field.name]"
            class="w-full border border-black px-3 py-2 bg-white/60 backdrop-blur-sm"
          >
            <option value="">Select...</option>
            <option v-for="opt in field.options || []" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </Field>
        </template>
      </template>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { FormField } from '@/types/form'
import { BUTTON_TYPES } from '@/constants'
import { useFormContext, Field, ErrorMessage } from 'vee-validate'
import { reactive } from 'vue'

const { errors } = useFormContext()

const props = defineProps<{
  source: FormField[]
  isFormValid?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', buttonName: string): void
}>()

const { values } = useFormContext()

const isPasswordVisible = reactive<Record<string, boolean>>({})

const togglePasswordVisibility = (name: string) => {
  isPasswordVisible[name] = !isPasswordVisible[name]
}

const buttonClass = (type: string) => {
  switch (type) {
    case BUTTON_TYPES.loginButton:
      return 'bg-black text-white px-10 py-2'
    case BUTTON_TYPES.saveButton:
      return 'bg-gray-700 text-white px-10 py-2'
    case BUTTON_TYPES.cancelButton:
      return 'bg-white text-black border px-10 py-2'
    default:
      return 'bg-gray-400 text-white px-10 py-2'
  }
}
</script>
