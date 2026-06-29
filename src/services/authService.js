import api from '@/api/axios'

const authService = {
  // ── Standard Auth ──────────────────────────────────
  async register(form) {
    const { data } = await api.post('/register', form)
    return data
  },

  async login(form) {
    const { data } = await api.post('/login', form)
    return data
  },

  async logout() {
    const { data } = await api.post('/logout')
    return data
  },

  async me() {
    const { data } = await api.get('/me')
    return data
  },

  // ── Google OAuth ───────────────────────────────────
  async googleAuthUrl() {
    const { data } = await api.get('/auth/google/url')
    return data
  },

  async googleCallback(code) {
    const { data } = await api.get('/auth/google/callback', { params: { code } })
    return data
  },
}

export default authService