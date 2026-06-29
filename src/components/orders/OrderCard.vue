<template>
  <router-link
    :to="`/orders/${order.id}`"
    class="group block bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all"
  >
    <div class="flex items-center justify-between gap-4">

      <!-- Left: icon + info -->
      <div class="flex items-center gap-4 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <ClipboardDocumentListIcon class="w-5 h-5 text-blue-500" />
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-gray-900 text-sm">Order #{{ order.id }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ formattedDate }} · {{ order.items?.length ?? 0 }} item(s)</p>
        </div>
      </div>

      <!-- Right: amount + badges + arrow -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="text-right hidden sm:block">
          <p class="font-bold text-gray-900 text-sm">${{ Number(order.total_amount).toFixed(2) }}</p>
          <div class="flex items-center gap-1.5 mt-1 justify-end">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="statusStyle">
              {{ ucfirst(order.status) }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="paymentStyle">
              {{ ucfirst(order.payment_status) }}
            </span>
          </div>
        </div>
        <ChevronRightIcon class="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>

    </div>

    <!-- Mobile: amount + badges -->
    <div class="sm:hidden mt-3 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="statusStyle">
          {{ ucfirst(order.status) }}
        </span>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="paymentStyle">
          {{ ucfirst(order.payment_status) }}
        </span>
      </div>
      <p class="font-bold text-gray-900 text-sm">${{ Number(order.total_amount).toFixed(2) }}</p>
    </div>

    <!-- Product thumbnails -->
    <div v-if="order.items?.length" class="mt-4 flex gap-2 flex-wrap">
      <div
        v-for="item in order.items.slice(0, 5)"
        :key="item.id"
        class="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center"
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
        class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500"
      >
        +{{ order.items.length - 5 }}
      </div>
    </div>

  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { imageUrl } from '@/api/axios'
import { ClipboardDocumentListIcon, ChevronRightIcon, CubeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  order: { type: Object, required: true }
})

const formattedDate = computed(() =>
  new Date(props.order.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
)

const statusStyle = computed(() => ({
  pending:    'bg-amber-50 text-amber-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped:    'bg-purple-50 text-purple-600',
  delivered:  'bg-green-50 text-green-600',
  completed:  'bg-emerald-50 text-emerald-600',
  cancelled:  'bg-red-50 text-red-500',
}[props.order.status] ?? 'bg-gray-100 text-gray-500'))

const paymentStyle = computed(() => ({
  paid:     'bg-green-50 text-green-600',
  unpaid:   'bg-amber-50 text-amber-600',
  refunded: 'bg-red-50 text-red-500',
}[props.order.payment_status] ?? 'bg-gray-100 text-gray-500'))

function ucfirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
</script>
