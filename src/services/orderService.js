import api from '@/api/axios'

const orderService = {
  // ── Fetch Orders ───────────────────────────────────
  async getOrders() {
    const { data } = await api.get('/orders')
    return data
  },

  async getOrder(id) {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  // ── Order Actions ──────────────────────────────────
  async checkout(payload) {
    const { data } = await api.post('/orders/checkout', payload)
    return data
  },

  async cancelOrder(id) {
    const { data } = await api.delete(`/orders/${id}/cancel`)
    return data
  },
}

export default orderService