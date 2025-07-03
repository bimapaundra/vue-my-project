import { ref } from 'vue'

export const toastMessage = ref('')
export const toastType = ref<'success' | 'error' | 'info' | 'warning'>('success')

export function useToastGlobal() {
    const showToast = (msg: string, type: typeof toastType.value = 'success') => {
        toastMessage.value = msg
        toastType.value = type
    }

    return { showToast }
}
