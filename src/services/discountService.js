import api from '@/api/axios'

const discountService = {
  // ── Public, active promo codes for the Deals page ──────
  async getPublicDiscounts() {
    const { data } = await api.get('/discounts')
    return data
  },
}

export default discountService
