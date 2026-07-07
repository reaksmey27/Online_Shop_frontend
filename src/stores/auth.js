import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {

    // ── State ────────────────────────────────────────────
    const token = ref(localStorage.getItem('token') ?? null)
    const user  = ref(JSON.parse(localStorage.getItem('user') ?? 'null'))

    // ── Getters ──────────────────────────────────────────
    const isLoggedIn = computed(() => !!token.value)

    // ── Actions ──────────────────────────────────────────

    async function register(form) {
        const data = await authService.register(form)
        _setAuth(data)
        return data
    }

    async function login(form) {
        const data = await authService.login(form)
        _setAuth(data)
        return data
    }

    async function logout() {
        try {
            await authService.logout()
        } catch {
            // Ignore errors — still clear local auth state
        } finally {
            _clearAuth()
        }
    }

    async function fetchUser() {
        const data = await authService.me()
        user.value = data
        localStorage.setItem('user', JSON.stringify(data))
        return data
    }
    async function loginWithGoogle() {
        const data = await authService.googleAuthUrl()
        window.location.href = data.url
    }

    async function googleCallback(code) {
        const data = await authService.googleCallback(code)
        _setAuth(data)
        return data
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
