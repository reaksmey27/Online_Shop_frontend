<template>
  <div class="flex-1 space-y-6 w-full">
    <div class="space-y-2">
      <p v-if="product.category?.name" class="text-xs font-black text-blue-600 uppercase tracking-widest">
        {{ product.category.name }}
      </p>
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ product.name }}</h1>

      <div class="flex items-center gap-3 flex-wrap">
        <p class="text-2xl font-black text-blue-600">${{ Number(product.price).toFixed(2) }}</p>

        <!-- Stock indicator -->
        <span
          class="text-xs font-bold px-2.5 py-1 rounded-md"
          :class="stockClass"
        >
          {{ stockLabel }}
        </span>

        <!-- Average rating badge -->
        <span v-if="product.average_rating" class="flex items-center gap-1 text-xs font-bold text-amber-600">
          <StarIcon class="w-3.5 h-3.5 fill-current" />
          {{ product.average_rating }}
        </span>
      </div>
    </div>

    <p class="text-sm text-gray-600 leading-relaxed max-w-2xl">
      {{ product.description || 'No description available.' }}
    </p>

    <!-- Delivery estimate -->
    <div class="flex items-center gap-2 text-xs text-gray-500 font-medium">
      <TruckIcon class="w-4 h-4 text-gray-400" />
      <span>Estimated delivery: <strong class="text-gray-700">{{ deliveryEstimate }}</strong></span>
    </div>

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
          >—</button>
          <span class="px-3 text-sm font-bold text-gray-800 min-w-[32px] text-center">{{ qty }}</span>
          <button
            type="button"
            @click="$emit('increment')"
            :disabled="qty >= product.stock"
            class="px-3 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:hover:bg-transparent h-full transition-colors"
          >+</button>
        </div>
        <span class="text-xs text-gray-400 font-medium">of {{ product.stock }}</span>
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          @click="$emit('add-to-cart')"
          :disabled="cartLoading || product.stock === 0"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/10 active:scale-[0.99]"
        >
          <ArrowPathIcon v-if="cartLoading" class="w-4 h-4 animate-spin" />
          <ShoppingCartIcon v-else class="w-4 h-4" />
          <span>{{ product.stock === 0 ? 'Out of Stock' : cartLoading ? 'Adding…' : 'Add to Cart' }}</span>
        </button>

        <button
          type="button"
          @click="$emit('toggle-wishlist')"
          class="p-3 border rounded-xl bg-white transition-all hover:bg-gray-50 active:scale-[0.99] flex items-center justify-center shadow-sm"
          :class="inWishlist ? 'border-red-200 text-red-500 bg-red-50/20 hover:bg-red-50/50' : 'border-gray-200 text-gray-400 hover:text-gray-600'"
          :title="inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'"
        >
          <HeartIconSolid v-if="inWishlist" class="w-5 h-5" />
          <HeartIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowPathIcon, HeartIcon, TruckIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  product:    { type: Object,  required: true },
  qty:        { type: Number,  default: 1 },
  cartLoading:{ type: Boolean, default: false },
  inWishlist: { type: Boolean, default: false },
  successMsg: { type: String,  default: '' },
})

defineEmits(['increment', 'decrement', 'add-to-cart', 'toggle-wishlist'])

const stockClass = computed(() => {
  const s = props.product.stock
  if (s === 0)  return 'bg-red-50 text-red-700'
  if (s <= 5)   return 'bg-orange-50 text-orange-700'
  return 'bg-emerald-50 text-emerald-700'
})

const stockLabel = computed(() => {
  const s = props.product.stock
  if (s === 0) return 'Out of Stock'
  if (s <= 5)  return `Only ${s} left!`
  return `In Stock (${s})`
})

const deliveryEstimate = computed(() => {
  const today = new Date()
  const low   = new Date(today); low.setDate(today.getDate() + 3)
  const high  = new Date(today); high.setDate(today.getDate() + 7)
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(low)} – ${fmt(high)}`
})
</script>
