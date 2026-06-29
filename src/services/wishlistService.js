import api from '@/api/axios'

const wishlistService = {
  // ── Manage Wishlist ────────────────────────────────
  async getWishlist() {
    const { data } = await api.get('/wishlist')
    return data
  },

  async addItem(productId) {
    const { data } = await api.post('/wishlist', { product_id: productId })
    return data
  },

  async removeItem(itemId) {
    const { data } = await api.delete(`/wishlist/${itemId}`)
    return data
  },
}

export default wishlistService