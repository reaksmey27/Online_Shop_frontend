<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div class="px-6 py-4 border-b border-gray-100">
      <h2 class="font-black text-gray-900">Order Items</h2>
    </div>
    <div class="divide-y divide-gray-50">
      <div v-for="item in items" :key="item.id" class="flex items-center gap-4 p-5">
        <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <img 
            v-if="item.product?.image"
            :src="imageUrl(item.product.image)"
            :alt="item.product?.name"
            class="w-full h-full object-cover"
            @error="e => e.target.style.display = 'none'"
          >
          <CubeIcon v-else class="w-7 h-7 text-gray-300" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-800 text-sm line-clamp-1">
            {{ item.product?.name ?? 'Product removed' }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            ${{ Number(item.price).toFixed(2) }} × {{ item.quantity }}
          </p>
        </div>
        <p class="font-black text-gray-900 shrink-0">
          ${{ (Number(item.price) * item.quantity).toFixed(2) }}
        </p>
      </div>
    </div>
    <div class="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
      <span class="font-black text-gray-900">Total</span>
      <span class="font-black text-blue-600 text-lg">
        ${{ Number(totalAmount).toFixed(2) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { imageUrl } from '@/api/axios'
import { CubeIcon } from '@heroicons/vue/24/outline'

defineProps({
  items: { type: Array, default: () => [] },
  totalAmount: { type: [String, Number], default: 0 }
})
</script>