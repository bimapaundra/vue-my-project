import { defineStore } from 'pinia'

export interface userData {
    userId: string,
    password: string,
    profileImage: string,
    salutation: string,
    firstName: string,
    lastName: string,
    email: string,
    homeAddress: string,
    country: string,
    postalCode: string,
    dateOfBirth: string,
    gender: string,
    maritalStatus: boolean,
    spouse: {
        salutation: string,
        firstName: string,
        lastName: string,
    },
    hobbies: string,
    favoriteSports: string,
    preferredMusic: string,
    preferredMovie: string,
}

export const useProfileStore = defineStore('profile', {
    state: (): { data: userData } => ({
        data: {
            profileImage: '',
            salutation: '',
            firstName: '',
            lastName: '',
            email: '',
            homeAddress: '',
            country: '',
            postalCode: '',
            dateOfBirth: '',
            gender: '',
            maritalStatus: false,
            spouse: {
                salutation: '',
                firstName: '',
                lastName: '',
            },
            hobbies: '',
            favoriteSports: '',
            preferredMusic: '',
            preferredMovie: '',
            userId: '',
            password: ''
        },
    }),

    actions: {
        updateProfile(newData: Partial<userData>) {
            this.data = { ...this.data, ...newData }
        },

        resetProfile() {
            this.data = {
                profileImage: '',
                salutation: '',
                firstName: '',
                lastName: '',
                email: '',
                homeAddress: '',
                country: '',
                postalCode: '',
                dateOfBirth: '',
                gender: '',
                maritalStatus: false,
                spouse: {
                    salutation: '',
                    firstName: '',
                    lastName: '',
                },
                hobbies: '',
                favoriteSports: '',
                preferredMusic: '',
                preferredMovie: '',
                userId: '',
                password: ''
            }
        },
    },

    persist: true,
})
