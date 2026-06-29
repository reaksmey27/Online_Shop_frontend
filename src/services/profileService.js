import api from '@/api/axios'

const profileService = {
  // ── Manage Profile ─────────────────────────────────
  async updateProfile(payload) {
    const { data } = await api.put('/profile', payload)
    return data
  },

  async updatePassword(payload) {
    const { data } = await api.put('/profile/password', payload)
    return data
  },
}

export default profileService