import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import AuthService from '@/services/AuthService';

// Cliente para la App Hija (Local / Espejo)
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Accept': 'application/json'
    }
});

// --- INTERCEPTOR DE REQUEST (Salida) ---
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem('access_token');

        if (token) {
            console.log("[Axios Local] Token encontrado en sessionStorage.");
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers.Authorization = authHeader;
        } else {
            console.warn("[Axios Local] ADVERTENCIA: No se encontró token en sessionStorage.");
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Flag para evitar múltiples ejecuciones concurrentes o bucles infinitos ante ráfagas de errores 401
let isHandlingAuthError = false;

// --- INTERCEPTOR DE RESPONSE (Llegada) ---
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401 && !isHandlingAuthError) {
            isHandlingAuthError = true;
            console.error('Sesión rechazada por Ecosistema (401). Limpiando sesión e iniciando re-autenticación.');
            sessionStorage.removeItem('access_token');
            sessionStorage.clear();
            // Redirigir al login una sola vez
            AuthService.login();
        }
        return Promise.reject(error);
    }
);

export default api;

