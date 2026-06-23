import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import AuthService from '../services/AuthService'
import { getAvatarUrl } from '../utils/imageUtils'
import axiosInstance from '../api/axios'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const MOTHER_API_URL = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export interface User {
    [key: string]: any;
    roles?: string[];
    permissions?: string[];
    permisos?: string[];
    avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
    // MIGRACIÓN DE ALMACENAMIENTO (Limpia cachés viejas si cambias de arquitectura)
    const STORAGE_VERSION = 'v2_inactivity_sso'; 

    if (localStorage.getItem('yk_storage_version') !== STORAGE_VERSION) {
        const keysToRemove = ['access_token', 'user_data', 'pkce_verifier', 'yk_pkce_verifier'];
        keysToRemove.forEach(k => {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        });
        localStorage.setItem('yk_storage_version', STORAGE_VERSION);
    }

    // --- STATE ---
    const user = ref<User | null>(JSON.parse(sessionStorage.getItem('user_data') || 'null'))
    const token = ref<string | null>(sessionStorage.getItem('access_token') || null)
    const processingSSO = ref<boolean>(false)
    const isReady = ref<boolean>(false)

    // --- VARIABLES REACTIVAS DE SOCKETS Y CONTROL DE INACTIVIDAD ---
    const echoInstance = ref<any>(null)
    const showInactivityModal = ref<boolean>(false)
    const inactivitySessionId = ref<string | null>(null)
    const inactivityCountdown = ref<number>(300)
    const isHeartbeatLoading = ref<boolean>(false)
    let countdownTimerId: ReturnType<typeof setInterval> | null = null

    // --- GETTERS ---
    const userAvatar = computed(() => {
        return getAvatarUrl(user.value?.avatar)
    })

    // --- ACTIONS ---

    async function login(redirectTo: string | null = null): Promise<void> {
        if (processingSSO.value) return; 
        processingSSO.value = true;
        
        if (redirectTo) {
            sessionStorage.setItem('auth_redirect_to', redirectTo);
        }
        
        await AuthService.login();
    }

    async function handlePKCECallback(code: string): Promise<void> {
        console.log(">>> [AuthStore] Iniciando intercambio de código por Token...");
        
        // Buscamos el verifier en las 4 variantes posibles
        const localPrefixed = localStorage.getItem('yk_pkce_verifier');
        const sessionPrefixed = sessionStorage.getItem('yk_pkce_verifier');
        const sessionLegacy = sessionStorage.getItem('pkce_verifier');
        const localLegacy = localStorage.getItem('pkce_verifier');

        const verifier = localPrefixed || sessionPrefixed || sessionLegacy || localLegacy;
        
        if (!verifier) {
            console.error(">>> [AuthStore] ERROR: No se encontró pkce_verifier en sessionStorage o localStorage.");
            throw new Error('No se encontró el verifier PKCE')
        }

        try {
            const response = await axios.post(`${MOTHER_API_URL}/oauth/token`, {
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                code_verifier: verifier,
                code: code
            });
            
            console.log(">>> [AuthStore] Token obtenido exitosamente.");
            token.value = response.data.access_token;
            sessionStorage.setItem('access_token', token.value!);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
            
            // Limpieza nuclear de verifiers
            localStorage.removeItem('yk_pkce_verifier');
            sessionStorage.removeItem('yk_pkce_verifier');
            sessionStorage.removeItem('pkce_verifier');
            localStorage.removeItem('pkce_verifier');
            
            sessionStorage.removeItem('auth_sso_lock');
            processingSSO.value = false;

            console.log(">>> [AuthStore] Sincronizando perfil JIT con Backend Hija...");
            await fetchUser(true); 

            // Inicializar WebSockets de inmediato tras obtener el token
            initSessionSocket()
        } catch (error) {
            console.error(">>> [AuthStore] ERROR EN INTERCAMBIO O FETCH:", error);
            throw error;
        }
    }

    function logout(): void {
        disconnectSessionSocket()
        user.value = null
        token.value = null
        isReady.value = false
        AuthService.logout()
    }

    function logoutLocal(): void {
        disconnectSessionSocket()
        user.value = null
        token.value = null
        isReady.value = false
        AuthService.logoutLocal()
    }

    let fetchUserPromise: Promise<void> | null = null;

    async function fetchUser(force = false): Promise<void> {
        if (!token.value) {
            isReady.value = true
            return
        }

        if (!force && user.value) {
            isReady.value = true
            return
        }

        if (fetchUserPromise) {
            return fetchUserPromise
        }

        fetchUserPromise = (async () => {
            try {
                const response = await axiosInstance.get('/me')
                user.value = response.data
                sessionStorage.setItem('user_data', JSON.stringify(user.value))
            } catch (error) {
                console.warn('Sesión expirada o inválida en Api Local', error)
                user.value = null
                isReady.value = true
                throw error;
            } finally {
                fetchUserPromise = null
                isReady.value = true
            }
        })()

        return fetchUserPromise
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

    // --- MÉTODOS DE SOCKETS Y CONTROL DE INACTIVIDAD ---
    function initSessionSocket(): void {
        if (!token.value || !user.value) return
        if (echoInstance.value) return // Evitar conexiones duplicadas

        (window as any).Pusher = Pusher

        echoInstance.value = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
            wsPort: import.meta.env.VITE_REVERB_PORT ? parseInt(import.meta.env.VITE_REVERB_PORT) : 8080,
            wssPort: import.meta.env.VITE_REVERB_PORT ? parseInt(import.meta.env.VITE_REVERB_PORT) : 8080,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: `${import.meta.env.VITE_MOTHER_API_URL}/api/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                    Accept: 'application/json'
                }
            }
        })

        // Escuchar canal privado del usuario centralizado
        echoInstance.value.private(`user.${user.value.id}`)
            .listen('.InactivityExpiringSoon', (e: any) => {
                inactivitySessionId.value = e.sessionId
                inactivityCountdown.value = Math.round(e.remainingSeconds) || 300
                showInactivityModal.value = true
                startLocalCountdown()
            })
            .listen('.SessionRenewed', (e: any) => {
                // Si otra pestaña/app renovó esta misma sesión, cerramos el modal de forma síncrona
                if (inactivitySessionId.value === e.sessionId) {
                    showInactivityModal.value = false
                    stopLocalCountdown()
                }
            })
            .listen('.SessionForceClosed', () => {
                stopLocalCountdown()
                disconnectSessionSocket()
                AuthService.logoutLocal()
                const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
                window.location.href = `${motherAppUrl}/login?session_expired=true`
            })
            .error((error: any) => {
                console.warn('Error de autorización en canal de sockets:', error)
                // Si la suscripción falla por token expirado/revocado (401 o 403) tras suspender la PC
                if (error && (error.status === 401 || error.status === 403)) {
                    stopLocalCountdown()
                    disconnectSessionSocket()
                    AuthService.logoutLocal()
                    const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
                    window.location.href = `${motherAppUrl}/login?session_expired=true`
                }
            })
    }

    function disconnectSessionSocket(): void {
        if (echoInstance.value) {
            echoInstance.value.disconnect()
            echoInstance.value = null
        }
        showInactivityModal.value = false
        inactivitySessionId.value = null
        stopLocalCountdown()
    }

    function startLocalCountdown(): void {
        if (countdownTimerId) clearInterval(countdownTimerId)
        countdownTimerId = setInterval(() => {
            if (inactivityCountdown.value > 0) {
                inactivityCountdown.value--
            } else {
                clearInterval(countdownTimerId!)
                AuthService.logoutLocal()
                const motherAppUrl = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
                window.location.href = `${motherAppUrl}/login?session_expired=true`
            }
        }, 1000)
    }

    function stopLocalCountdown(): void {
        if (countdownTimerId) {
            clearInterval(countdownTimerId)
            countdownTimerId = null
        }
    }

    async function sendHeartbeatPing(): Promise<void> {
        if (!inactivitySessionId.value || isHeartbeatLoading.value) return
        isHeartbeatLoading.value = true
        try {
            const motherApiUrl = import.meta.env.VITE_MOTHER_API_URL || 'http://localhost:8000'
            await axios.post(`${motherApiUrl}/api/sso/heartbeat`, {
                session_id: inactivitySessionId.value
            }, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })

            showInactivityModal.value = false
            stopLocalCountdown()
        } catch (err) {
            console.error('Error al enviar ping de heartbeat a la Madre:', err)
            logout()
        } finally {
            isHeartbeatLoading.value = false
        }
    }

    return {
        user,
        token,
        processingSSO,
        isReady,
        userAvatar,
        login,
        handlePKCECallback,
        logout,
        logoutLocal,
        fetchUser,
        checkAuth,
        hasPermission,
        hasRole,
        // Sockets e inactividad
        echoInstance,
        showInactivityModal,
        inactivitySessionId,
        inactivityCountdown,
        isHeartbeatLoading,
        initSessionSocket,
        disconnectSessionSocket,
        sendHeartbeatPing
    }
})
