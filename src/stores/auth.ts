import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '../services/AuthService'
import { getAvatarUrl } from '../utils/imageUtils'

export interface User {
    [key: string]: any;
    roles?: string[];
    permissions?: string[];
    permisos?: string[];
    avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
    // --- STATE ---
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem('access_token') || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    // --- GETTERS ---
    const userAvatar = computed(() => {
        return getAvatarUrl(user.value?.avatar)
    })

    // --- ACTIONS ---

    async function login(): Promise<void> {
        processingSSO.value = true
        await AuthService.login()
    }

    async function handleDirectToken(incomingToken: string, userData: any = null): Promise<void> {
        processingSSO.value = true
        try {
            const data = AuthService.processDirectToken(incomingToken, userData)
            token.value = data.access_token

            if (data.user) {
                user.value = data.user
            } else {
                await fetchUser()
            }

        } catch (error) {
            console.error('Error procesando token SSO:', error)
            throw error
        } finally {
            processingSSO.value = false
        }
    }

    function logout(): void {
        user.value = null
        token.value = null
        isReady.value = false
        AuthService.logout()
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) {
            isReady.value = true
            return
        }

        try {
            const { default: axios } = await import('../api/axios')
            const response = await axios.get('/me')
            const userData = response.data

            user.value = userData
            localStorage.setItem('user_data', JSON.stringify(userData))
        } catch (error) {
            console.warn('Sesión expirada o inválida, o error al conectar con Api Local', error)
        } finally {
            isReady.value = true
        }
    }

    function hasPermission(permission: string): boolean {
        if (!user.value) return false

        if (user.value.roles && user.value.roles.includes('Super Admin')) return true

        const userPerms = user.value.permissions || user.value.permisos || []
        if (Array.isArray(userPerms)) {
            return userPerms.includes(permission)
        }

        return false
    }

    function hasRole(role: string): boolean {
        if (!user.value) return false
        return !!(user.value.roles && user.value.roles.includes(role))
    }

    async function checkAuth(): Promise<void> {
        await fetchUser()
    }

    return {
        user,
        token,
        processingSSO,
        isReady,
        userAvatar,
        login,
        handleDirectToken,
        logout,
        fetchUser,
        checkAuth,
        hasPermission,
        hasRole
    }
})
