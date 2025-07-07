import type { AxiosError } from 'axios'

export function handleAxiosError(err: unknown): string {
    const axiosErr = err as AxiosError<{ message?: string }>
    return (
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        'An unexpected error occurred'
    )
}
