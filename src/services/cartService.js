import api from '@/api/axios'

const cartService = {
  // ── Manage Cart State ──────────────────────────────
  async getCart(params = {}) {
    const { data } = await api.get('/cart', { params })
    return data
  },

  // ── Mutate Items ───────────────────────────────────
  async addItem(productId, quantity = 1, variantId = null) {
    const { data } = await api.post('/cart', {
      product_id: productId,
      quantity,
      ...(variantId ? { product_variant_id: variantId } : {}),
    })
    return data
  },

  async updateItem(itemId, quantity) {
    const { data } = await api.put(`/cart/${itemId}`, { quantity })
    return data
  },

  // ── Remove Items ───────────────────────────────────
  async removeItem(itemId) {
    const { data } = await api.delete(`/cart/${itemId}`)
    return data
  },

  async removeItems(itemIds) {
    const results = await Promise.all(itemIds.map(id => api.delete(`/cart/${id}`)))
    return results.map(r => r.data)
  },
}

export default cartService