<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-4">
    <h3 class="font-black text-gray-900 tracking-tight">Order Summary</h3>

    <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
      <div v-for="item in items" :key="item.id" class="flex items-center gap-3 py-0.5">
        <div class="w-11 h-11 rounded-lg overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center border border-gray-100">
          <img v-if="item.product?.image" :src="imageUrl(item.product.image)" :alt="item.product.name" class="w-full h-full object-cover">
          <CubeIcon v-else class="w-5 h-5 text-gray-300" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-gray-800 truncate">{{ item.product?.name }}</p>
          <p class="text-[11px] font-medium text-gray-400 mt-0.5">Quantity: {{ item.quantity }}</p>
        </div>
        <p class="text-xs font-black text-gray-900 shrink-0">
          ${{ (Number(item.product?.price || 0) * item.quantity).toFixed(2) }}
        </p>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-4 space-y-2.5">
      <div class="flex justify-between text-xs font-bold text-gray-500">
        <span>Subtotal</span>
        <span class="text-gray-800">${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-xs font-bold text-gray-500">
        <span>Shipping</span>
        <span :class="isFreeShipping ? 'text-emerald-600 font-extrabold text-[10px]' : 'text-gray-800'">
          {{ isFreeShipping ? 'FREE' : '$5.00' }}
        </span>
      </div>
      <div class="flex justify-between font-black text-gray-900 text-base pt-3 border-t border-gray-100">
        <span>Total Amount</span>
        <span class="text-blue-600">${{ grandTotal.toFixed(2) }}</span>
      </div>
    </div>

    <button
      type="button"
      @click="$emit('submit')"
      :disabled="submitting"
      class="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-600/10"
      :class="[isMobile ? 'lg:hidden' : 'hidden lg:flex', submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]']"
    >
      <ArrowPathIcon v-if="submitting" class="w-4 h-4 animate-spin" />
      <LockClosedIcon v-else class="w-4 h-4" />
      <span>{{ submitting ? 'Placing Order...' : isMobile ? `Place Order · $${grandTotal.toFixed(2)}` : 'Place Order' }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { imageUrl } from '@/api/axios'
import { CubeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  items: { type: Array, default: () => [] },
  submitting: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false }
})
defineEmits(["submit"])

const subtotal = computed(() =>
  props.items.reduce((sum, item) => sum + Number(item.product?.price || 0) * item.quantity, 0)
)
const isFreeShipping = computed(() => subtotal.value >= 50)
const grandTotal = computed(() => subtotal.value + (isFreeShipping.value || subtotal.value === 0 ? 0 : 5))
</script>