<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-5 flex-1">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Order</p>
        <h1 class="text-xl font-bold text-gray-900">#{{ orderId }}</h1>
        <p class="text-sm text-gray-400 mt-0.5">Placed {{ formattedDate }}</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusStyle">
          {{ ucfirst(status) }}
        </span>
        <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="paymentStyle">
          {{ ucfirst(paymentStatus) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orderId:       { type: [String, Number], required: true },
  createdAt:     { type: String, required: true },
  status:        { type: String, required: true },
  paymentStatus: { type: String, required: true }
})

const formattedDate = computed(() =>
  new Date(props.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
)

const statusStyle = computed(() => ({
  pending:    'bg-amber-50 text-amber-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped:    'bg-purple-50 text-purple-600',
  delivered:  'bg-green-50 text-green-600',
  cancelled:  'bg-red-50 text-red-500',
}[props.status] ?? 'bg-gray-100 text-gray-500'))

const paymentStyle = computed(() => ({
  paid:     'bg-green-50 text-green-600',
  unpaid:   'bg-amber-50 text-amber-600',
  refunded: 'bg-red-50 text-red-500',
}[props.paymentStatus] ?? 'bg-gray-100 text-gray-500'))

function ucfirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
</script>
