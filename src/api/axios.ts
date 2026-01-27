import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

// Cliente para la App Hija (Local / Espejo)
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`, // Aseguramos que apunte a /api
    // withCredentials: true, // COMENTADO: Esto puede causar 401 si el backend no espera cookies
    headers: {
        'Accept': 'application/json'
    }
});

// --- INTERCEPTOR DE REQUEST (Salida) ---
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');

        console.log(`[Axios Local] Preparando petición a: ${config.url}`);

        if (token) {
            console.log("[Axios Local] Token encontrado en localStorage. Agregando header Authorization.");
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers.Authorization = authHeader;
        } else {
            console.warn("[Axios Local] ADVERTENCIA: No se encontró token en localStorage. La petición irá sin autenticación.");
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPONSE (Llegada) ---
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            console.error('[Axios Local] Error 401. El token fue enviado pero rechazado por el servidor.');
            console.error('Detalles del error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;
