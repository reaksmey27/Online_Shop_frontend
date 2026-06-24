<template>
  <div class="flex-1 space-y-6 w-full">
    <div class="space-y-2">
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ product.name }}</h1>
      <div class="flex items-center gap-3">
        <p class="text-2xl font-black text-blue-600">${{ Number(product.price).toFixed(2) }}</p>
        <span 
          class="text-xs font-bold px-2.5 py-1 rounded-md"
          :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
        >
          {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
        </span>
      </div>
    </div>

    <p class="text-sm text-gray-600 leading-relaxed max-w-2xl">
      {{ product.description || 'No alternative production catalog description variables defined.' }}
    </p>

    <div v-if="successMsg" class="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 font-medium text-sm rounded-xl flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span>{{ successMsg }}</span>
    </div>

    <div class="pt-4 space-y-4 max-w-sm">
      <div v-if="product.stock > 0" class="flex items-center gap-2">
        <label class="text-xs font-black text-gray-700 tracking-wide uppercase mr-2">Quantity</label>
        <div class="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm h-10">
          <button 
            type="button" 
            @click="$emit('decrement')" 
            :disabled="qty <= 1"
            class="px-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:hover:bg-transparent h-full transition-colors"
          >
            —
          </button>
          <span class="px-3 text-sm font-bold text-gray-800 min-w-[32px] text-center">{{ qty }}</span>
          <button 
            type="button" 
            @click="$emit('increment')" 
            :disabled="qty >= product.stock"
            class="px-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:hover:bg-transparent h-full transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          @click="$emit('add-to-cart')"
          :disabled="cartLoading || product.stock === 0"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/10 active:scale-[0.99]"
        >
          <ArrowPathIcon v-if="cartLoading" class="w-4 h-4 animate-spin" />
          <span>{{ product.stock === 0 ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Cart' }}</span>
        </button>

        <button
          type="button"
          @click="$emit('toggle-wishlist')"
          class="p-3 border rounded-xl bg-white transition-all hover:bg-gray-50 active:scale-[0.99] flex items-center justify-center shadow-sm"
          :class="inWishlist ? 'border-red-200 text-red-500 bg-red-50/20 hover:bg-red-50/50' : 'border-gray-200 text-gray-400 hover:text-gray-600'"
        >
          <HeartIconSolid v-if="inWishlist" class="w-5 h-5" />
          <HeartIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'

defineProps({
  product: { type: Object, required: true },
  qty: { type: Number, default: 1 },
  cartLoading: { type: Boolean, default: false },
  inWishlist: { type: Boolean, default: false },
  successMsg: { type: String, default: '' }
})

defineEmits(['increment', 'decrement', 'add-to-cart', 'toggle-wishlist'])
</script>