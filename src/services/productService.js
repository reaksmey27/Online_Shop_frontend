import api from '@/api/axios'

const productService = {
  // ── Browse Products ────────────────────────────────
  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params })
    return data
  },

  async getProduct(id) {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async getRelated(id) {
    const { data } = await api.get(`/products/${id}/related`)
    return data
  },

  // ── Categories ─────────────────────────────────────
  async getCategories() {
    const { data } = await api.get('/categories')
    return data
  },
}

export default productService