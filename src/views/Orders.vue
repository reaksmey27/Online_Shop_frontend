<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 antialiased">

    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">My Orders</h1>
      <p class="text-sm text-gray-400 mt-1">Track and manage your orders</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <div 
        v-for="n in 3" 
        :key="n"
        class="bg-white border border-gray-100 rounded-2xl h-28 animate-pulse" 
      />
    </div>

    <OrdersEmptyState v-else-if="orders.length === 0" />

    <div v-else class="space-y-4">
      <OrderCard 
        v-for="order in orders" 
        :key="order.id" 
        :order="order" 
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

import OrderCard from '@/components/orders/OrderCard.vue'
import OrdersEmptyState from '@/components/orders/OrdersEmptyState.vue'

const orders = ref([])
const loading = ref(true)

async function fetchOrders() {
  loading.value = true
  try {
    const res = await api.get('/orders')
    orders.value = res.data || []
  } catch (e) {
    console.error('Error fetching transactional order index history:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>