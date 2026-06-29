import { defineStore } from 'pinia'
import { ref } from 'vue'
import cartService from '@/services/cartService'

export const useCartStore = defineStore('cart', () => {
    const count = ref(0)

    async function fetchCount() {
        try {
            const data  = await cartService.getCart()
            count.value = (data.items ?? []).length
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
