<template>
  <div class="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <ClipboardDocumentListIcon class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p class="font-black text-gray-900">Order {{ order.id }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ formattedDate }}</p>
          <p class="text-xs text-gray-500 mt-1">
            {{ order.items?.length ?? 0 }} item(s)
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <div class="text-right">
          <p class="font-black text-gray-900">
            ${{ Number(order.total_amount).toFixed(2) }}
          </p>
          <div class="flex items-center gap-2 mt-1 justify-end">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="statusStyle">
              {{ ucfirst(order.status) }}
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="paymentStyle">
              {{ ucfirst(order.payment_status) }}
            </span>
          </div>
        </div>
        <router-link 
          :to="`/orders/${order.id}`"
          class="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </router-link>
      </div>
    </div>

    <div v-if="order.items?.length" class="mt-4 flex gap-2 flex-wrap">
      <div 
        v-for="item in order.items.slice(0, 5)" 
        :key="item.id"
        class="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center"
      >
        <img 
          v-if="item.product?.image"
          :src="imageUrl(item.product.image)"
          :alt="item.product?.name"
          class="w-full h-full object-cover"
          @error="e => e.target.style.display = 'none'"
        >
        <CubeIcon v-else class="w-4 h-4 text-gray-300" />
      </div>
      <div 
        v-if="order.items.length > 5"
        class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500"
      >
        +{{ order.items.length - 5 }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { imageUrl } from '@/api/axios'
import { ClipboardDocumentListIcon, ChevronRightIcon, CubeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  order: { type: Object, required: true }
})

const formattedDate = computed(() => {
  return new Date(props.order.created_at).toLocaleDateString('en-US', {
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
  }[props.order.status] ?? 'bg-gray-100 text-gray-700'
})

const paymentStyle = computed(() => {
  return {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-yellow-100 text-yellow-700',
    refunded: 'bg-red-100 text-red-700',
  }[props.order.payment_status] ?? 'bg-gray-100 text-gray-700'
})

function ucfirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
</script>