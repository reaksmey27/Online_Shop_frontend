import api from '@/api/axios'

const reviewService = {
  // ── Product Reviews ────────────────────────────────
  async getReviews(productId) {
    const { data } = await api.get(`/products/${productId}/reviews`)
    return data
  },

  async submitReview(payload) {
    const { data } = await api.post('/reviews', payload)
    return data
  },
}

export default reviewService