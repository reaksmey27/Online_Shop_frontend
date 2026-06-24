<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 antialiased">

    <div class="mb-6">
      <router-link to="/orders" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ChevronLeftIcon class="w-4 h-4" />
        Back to Orders
      </router-link>
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="bg-gray-100 h-20 rounded-2xl" />
      <div class="bg-gray-100 h-64 rounded-2xl" />
    </div>

    <div v-else-if="!order" class="text-center py-20">
      <ExclamationCircleIcon class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h3 class="font-bold text-gray-700">Order not found</h3>
      <router-link to="/orders" class="mt-4 inline-block text-blue-600 text-sm hover:underline">
        Back to Orders
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <OrderHeader 
        :order-id="order.id" 
        :created-at="order.created_at" 
        :status="order.status" 
        :payment-status="order.payment_status" 
      />

      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 space-y-4">
          <OrderItemsList :items="order.items" :total-amount="order.total_amount" />
        </div>
        
        <OrderSidebarInfo 
          :address="order.shipping_address"
          :payment-method="order.payment_method"
          :payment-status="order.payment_status"
          :current-status="order.status"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import { ChevronLeftIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import OrderHeader from '@/components/orders/OrderHeader.vue'
import OrderItemsList from '@/components/orders/OrderItemsList.vue'
import OrderSidebarInfo from '@/components/orders/OrderSidebarInfo.vue'

const route = useRoute()
const order = ref(null)
const loading = ref(true)

async function fetchOrder() {
  loading.value = true
  try {
    const res = await api.get(`/orders/${route.params.id}`)
    order.value = res.data
  } catch (e) {
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)
</script>