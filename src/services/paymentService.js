import api from '@/api/axios'

const paymentService = {
  // ── ABA PayWay ──────────────────────────────────────
  async initPayway(orderId, paymentOption = 'abapay') {
    const { data } = await api.post(`/orders/${orderId}/payway/init`, {
      payment_option: paymentOption,
    })
    return data
  },

  async checkPaywayStatus(orderId) {
    const { data } = await api.get(`/orders/${orderId}/payway/status`)
    return data
  },
}

export default paymentService
