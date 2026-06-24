<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Order #{{ orderId }}</h1>
        <p class="text-sm text-gray-400 mt-1">
          Placed on {{ formattedDate }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-full text-sm font-semibold" :class="statusStyle">
          {{ ucfirst(status) }}
        </span>
        <span class="px-3 py-1.5 rounded-full text-sm font-semibold" :class="paymentStyle">
          {{ ucfirst(paymentStatus) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orderId: { type: [String, Number], required: true },
  createdAt: { type: String, required: true },
  status: { type: String, required: true },
  paymentStatus: { type: String, required: true }
})

const formattedDate = computed(() => {
  return new Date(props.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
})

const statusStyle = computed(() => {
  return {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }[props.status] ?? 'bg-gray-100 text-gray-700'
})

const paymentStyle = computed(() => {
  return {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-yellow-100 text-yellow-700',
    refunded: 'bg-red-100 text-red-700',
  }[props.paymentStatus] ?? 'bg-gray-100 text-gray-700'
})

function ucfirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
</script>