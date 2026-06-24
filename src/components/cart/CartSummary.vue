<template>
  <div class="w-full lg:w-80 flex-shrink-0">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24 space-y-5">
      <h3 class="font-black text-gray-900 text-base tracking-tight">Order Summary</h3>

      <div class="space-y-3 max-h-48 overflow-y-auto pr-1">
        <div 
          v-for="item in selectedItems" 
          :key="item.id"
          class="flex items-center justify-between text-xs"
        >
          <span class="text-gray-600 truncate flex-1 mr-3">
            {{ item.product?.name }}
            <span class="text-gray-400 font-bold ml-1">× {{ item.quantity }}</span>
          </span>
          <span class="font-semibold text-gray-800 flex-shrink-0">
            ${{ (Number(item.product?.price || 0) * item.quantity).toFixed(2) }}
          </span>
        </div>

        <div v-if="!hasItems" class="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-100 rounded-xl">
          No items selected
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4 space-y-2.5">
        <div class="flex justify-between text-xs text-gray-600">
          <span>Subtotal</span>
          <span class="font-medium text-gray-800">${{ totalAmount.toFixed(2) }}</span>
        </div>
        
        <div class="flex justify-between text-xs text-gray-600">
          <span>Shipping</span>
          <span :class="isFreeShipping ? 'text-emerald-600 font-bold' : 'font-medium text-gray-800'">
            {{ isFreeShipping ? 'Free' : '$5.00' }}
          </span>
        </div>
        
        <div class="flex justify-between font-black text-gray-900 text-base pt-3 border-t border-gray-100">
          <span>Total</span>
          <span class="text-blue-600">${{ finalGrandTotal.toFixed(2) }}</span>
        </div>
      </div>

      <div v-if="showShippingThreshold" class="bg-blue-50/70 border border-blue-100/50 rounded-xl p-3 text-[11px] text-blue-700 font-medium text-center">
        Add <span class="font-bold">${{ missingAmountForFreeShipping }}</span> more for free shipping!
      </div>

      <div class="pt-2 space-y-2">
        <button
          @click="$emit('checkout')"
          :disabled="!hasItems"
          class="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          :class="hasItems 
            ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] shadow-sm shadow-blue-100' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50'"
        >
          <LockClosedIcon class="w-4 h-4 stroke-[2]" />
          Checkout ({{ selectedItems.length }} items)
        </button>

        <router-link 
          to="/products"
          class="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon class="w-4 h-4 stroke-[2]" />
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LockClosedIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  selectedItems: { type: Array, default: () => [] },
  totalAmount: { type: Number, default: 0 }
})

defineEmits(['checkout'])

const SHIPPING_COST = 5
const FREE_SHIPPING_THRESHOLD = 50

const hasItems = computed(() => props.selectedItems.length > 0)

const isFreeShipping = computed(() => props.totalAmount >= FREE_SHIPPING_THRESHOLD)

const showShippingThreshold = computed(() => props.totalAmount > 0 && props.totalAmount < FREE_SHIPPING_THRESHOLD)

const missingAmountForFreeShipping = computed(() => (FREE_SHIPPING_THRESHOLD - props.totalAmount).toFixed(2))

const finalGrandTotal = computed(() => {
  if (props.totalAmount === 0) return 0
  return props.totalAmount + (isFreeShipping.value ? 0 : SHIPPING_COST)
})
</script>