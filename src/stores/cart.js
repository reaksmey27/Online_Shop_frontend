import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useCartStore = defineStore('cart', () => {
    const count = ref(0)

    async function fetchCount() {
        try {
            const res = await api.get('/cart')
            count.value = (res.data.items ?? []).length
        } catch {
            count.value = 0
        }
    }

    function increment(by = 1) {
        count.value += by
    }

    function decrement(by = 1) {
        count.value = Math.max(0, count.value - by)
    }

    function reset() {
        count.value = 0
    }

    return { count, fetchCount, increment, decrement, reset }
})
