import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import type { userData } from '@/stores/profile'

const mock = new MockAdapter(axios, { delayResponse: 300 })

function getUsersFromStorage(): userData[] {
    return JSON.parse(localStorage.getItem('users') || '[]')
}

function saveUsersToStorage(users: userData[]): void {
    localStorage.setItem('users', JSON.stringify(users))
}

mock.onPost('/api/register').reply(config => {
    try {
        const profileStore = useProfileStore()
        const authStore = useAuthStore()

        const newUser: userData = JSON.parse(config.data)
        const users = getUsersFromStorage()

        const exists = users.some(u => u.userId === newUser.userId)
        if (exists) {
            return [400, { message: 'User already exists' }]
        }

        users.push(newUser)
        saveUsersToStorage(users)

        authStore.user = { userId: newUser.userId }
        authStore.isLogin = true
        profileStore.updateProfile(newUser)

        return [200, { message: 'Registration successful', userId: newUser.userId }]
    } catch (error) {
        console.log(error)
        return [500, { message: 'An error occurred during registration' }]
    }
})

mock.onPost('/api/login').reply(config => {
    try {
        const { userId, password, remember }: { userId: string, password: string, remember?: boolean } = JSON.parse(config.data)

        const authStore = useAuthStore()
        const profileStore = useProfileStore()

        const users = getUsersFromStorage()
        const user = users.find(u => u.userId === userId && u.password === password)

        if (!user) {
            return [401, { message: 'Incorrect email or password' }]
        }

        authStore.user = { userId: user.userId }
        authStore.isLogin = true
        profileStore.updateProfile(user)

        if (remember) {
            document.cookie = `auth_user=${JSON.stringify(authStore.user)}; max-age=${60 * 60 * 24 * 365}`
        }

        return [200, { message: 'Login successful', user: authStore.user }]
    } catch (error) {
        console.log(error)
        return [500, { message: 'An error occurred during login' }]
    }
})

mock.onGet(/\/api\/profile\/.+/).reply(config => {
    try {
        const userId = config.url?.split('/').pop()
        if (!userId) {
            return [400, { message: 'User ID is required' }]
        }

        const users = getUsersFromStorage()
        const user = users.find(u => u.userId === userId)

        if (!user) {
            return [404, { message: 'User not found' }]
        }

        return [200, { profile: user }]
    } catch (error) {
        console.error(error)
        return [500, { message: 'An error occurred while fetching profile' }]
    }
})

mock.onPost('/api/logout').reply(() => {
    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    authStore.logout()
    profileStore.resetProfile()

    return [200, { message: 'Logged out successfully' }]
})

mock.onPatch(/\/api\/profile\/.+/).reply(config => {
    try {
        const profileStore = useProfileStore()
        const authStore = useAuthStore()
        const userId = config.url?.split('/').pop()

        if (!userId) {
            return [400, { message: 'User ID is required' }]
        }

        const updateData: Partial<userData> = JSON.parse(config.data)
        const users = getUsersFromStorage()

        const index = users.findIndex(u => u.userId === userId)
        if (index === -1) {
            return [404, { message: 'User not found' }]
        }

        users[index] = { ...users[index], ...updateData }
        saveUsersToStorage(users)

        if (authStore.user?.userId === userId) {
            profileStore.updateProfile(users[index])
        }

        return [200, { message: 'Profile updated', profile: users[index] }]
    } catch (error) {
        console.error(error)
        return [500, { message: 'An error occurred while updating profile' }]
    }
})
