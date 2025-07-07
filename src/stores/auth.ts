import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

interface User {
    userId: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isLogin: false,
    }),

    actions: {
        logout() {
            this.user = null
            this.isLogin = false
            Cookies.remove('auth_user')
        },

        getCurrentUser() {
            return this.user
        },

        checkIsLogin() {
            return this.isLogin
        },

        tryAutoLogin() {
            const cookieUser = Cookies.get('auth_user')
            if (cookieUser) {
                try {
                    const parsed = JSON.parse(cookieUser)
                    this.user = parsed
                    this.isLogin = true
                } catch (err) {
                    this.logout()
                    throw err
                }
            }
        },
    },
})
