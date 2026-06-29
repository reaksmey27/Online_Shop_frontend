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
// Handle 401 Unauthorized globally using Vue Router (no hard reload)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Use dynamic import to avoid circular dep; push via router instance
            import('@/router').then(({ default: router }) => {
                if (router.currentRoute.value.name !== 'login') {
                    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
                }
            })
        }
        return Promise.reject(error)
    }
)

export function imageUrl(path) {
    if (!path) return null
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${BASE_URL}/storage/${path}`
}

export default api
