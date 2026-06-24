import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {

    // ── State ────────────────────────────────────────────
    const token = ref(localStorage.getItem('token') ?? null)
    const user  = ref(JSON.parse(localStorage.getItem('user') ?? 'null'))

    // ── Getters ──────────────────────────────────────────
    const isLoggedIn = computed(() => !!token.value)

    // ── Actions ──────────────────────────────────────────

    async function register(form) {
        const res = await api.post('/register', form)
        _setAuth(res.data)
        return res.data
    }

    async function login(form) {
        const res = await api.post('/login', form)
        _setAuth(res.data)
        return res.data
    }

    async function logout() {
        try {
            await api.post('/logout')
        } catch {
            // Ignore errors — still clear local auth state
        } finally {
            _clearAuth()
        }
    }

    async function fetchUser() {
        const res  = await api.get('/me')
        user.value = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
    }

    /**
     * Get the Google OAuth redirect URL from the backend
     * then open it so the user can authenticate with Google.
     */
    async function loginWithGoogle() {
        const res = await api.get('/auth/google/url')
        window.location.href = res.data.url
    }

    /**
     * Called on the /auth/google/callback page.
     * Sends the authorization code to our backend to exchange for a token.
     */
    async function googleCallback(code) {
        const res = await api.get('/auth/google/callback', { params: { code } })
        _setAuth(res.data)
        return res.data
    }

    // ── Private helpers ───────────────────────────────────

    function _setAuth(data) {
        token.value = data.token
        user.value  = data.user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    function _clearAuth() {
        token.value = null
        user.value  = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return {
        token,
        user,
        isLoggedIn,
        register,
        login,
        logout,
        fetchUser,
        loginWithGoogle,
        googleCallback,
    }
})
