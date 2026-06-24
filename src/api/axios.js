import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://online-shop.test'

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        Accept:         'application/json',
    },
    withCredentials: false,
})

// ── Request Interceptor ──────────────────────────────────
// Attach Bearer token on every request automatically
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────────────
// Handle 401 Unauthorized globally — clear auth and redirect
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Only redirect if not already on the login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

/**
 * Convert a stored image value to a full URL.
 * Handles three cases:
 *   1. Already a full URL (http/https) — return as-is
 *   2. A relative storage path — prefix with Laravel's storage URL
 *   3. Empty / null — return null (caller renders fallback)
 */
export function imageUrl(path) {
    if (!path) return null
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${BASE_URL}/storage/${path}`
}

export default api
