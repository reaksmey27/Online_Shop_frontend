<template>
  <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">

    <div class="px-5 py-4 border-b border-gray-50">
      <h2 class="font-semibold text-gray-900 text-sm">Order Items</h2>
    </div>

    <div class="divide-y divide-gray-50">
      <div v-for="item in items" :key="item.id" class="flex items-center gap-4 px-5 py-4">

        <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <img
            v-if="item.product?.image"
            :src="imageUrl(item.product.image)"
            :alt="item.product?.name"
            class="w-full h-full object-cover"
            @error="e => e.target.style.display = 'none'"
          >
          <CubeIcon v-else class="w-8 h-8 text-gray-300" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-800 text-sm line-clamp-1">
            {{ item.product?.name ?? 'Product removed' }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            <span v-if="item.variant_label">Size: {{ item.variant_label }} &middot; </span>${{ Number(item.price).toFixed(2) }} × {{ item.quantity }}
          </p>
        </div>

        <p class="font-semibold text-gray-900 text-sm shrink-0">
          ${{ (Number(item.price) * item.quantity).toFixed(2) }}
        </p>

      </div>
    </div>

    <div class="px-5 py-4 border-t border-gray-100 bg-gray-50/50 space-y-1.5">
      <div v-if="subtotal !== null" class="flex justify-between items-center text-xs text-gray-500">
        <span>Subtotal</span>
        <span>${{ Number(subtotal).toFixed(2) }}</span>
      </div>
      <div v-if="discountAmount !== null && Number(discountAmount) > 0" class="flex justify-between items-center text-xs text-emerald-600 font-semibold">
        <span>Discount{{ discountCode ? ` (${discountCode})` : '' }}</span>
        <span>-${{ Number(discountAmount).toFixed(2) }}</span>
      </div>
      <div v-if="taxAmount !== null && Number(taxRate) > 0" class="flex justify-between items-center text-xs text-gray-500">
        <span>Tax ({{ Number(taxRate) }}%)</span>
        <span>${{ Number(taxAmount).toFixed(2) }}</span>
      </div>
      <div class="flex justify-between items-center pt-1.5">
        <span class="text-sm font-medium text-gray-500">Total</span>
        <span class="font-bold text-gray-900">
          ${{ Number(totalAmount).toFixed(2) }}
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { imageUrl } from '@/api/axios'
import { CubeIcon } from '@heroicons/vue/24/outline'

defineProps({
  items:            { type: Array, default: () => [] },
  totalAmount:      { type: [String, Number], default: 0 },
  subtotal:         { type: [String, Number, null], default: null },
  taxRate:          { type: [String, Number, null], default: null },
  taxAmount:        { type: [String, Number, null], default: null },
  discountCode:     { type: [String, null], default: null },
  discountAmount:   { type: [String, Number, null], default: null }
})
</script>