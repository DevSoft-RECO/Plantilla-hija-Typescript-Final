import axios, { type InternalAxiosRequestConfig } from 'axios';

// Cliente para la App Madre (Auth y Datos Globales)
const motherApi = axios.create({
    baseURL: import.meta.env.VITE_MOTHER_API_URL, // Generalmente el backend madre (ej puerto 8000)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para inyectar el token si es necesario
motherApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // CRÍTICO: Leer de sessionStorage, NO de localStorage
    const token = sessionStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Flag anti-bucle ante ráfagas 401
let isHandlingMotherAuthError = false;

// Interceptor de respuesta ante 401
motherApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401 && !isHandlingMotherAuthError) {
            isHandlingMotherAuthError = true;
            console.error('[Mother API] Sesión 401 rechazada. Limpiando y redirigiendo al SSO.');
            sessionStorage.removeItem('access_token');
            sessionStorage.clear();
            const AuthService = (await import('@/services/AuthService')).default;
            AuthService.login();
        }
        return Promise.reject(error);
    }
);

export default motherApi;

