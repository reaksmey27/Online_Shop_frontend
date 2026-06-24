<template>
  <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden
              shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex group">

    <!-- Image -->
    <router-link :to="`/products/${product.id}`" class="flex-shrink-0">
      <div class="w-28 h-full bg-gray-50 flex items-center justify-center overflow-hidden
                  border-r border-gray-100">
        <img v-if="product.image"
             :src="imageUrl(product.image)"
             :alt="product.name"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             @error="e => e.target.style.opacity = '0'">
        <CubeIcon v-else class="w-10 h-10 text-gray-300 stroke-[1.5]" />
      </div>
    </router-link>

    <!-- Info -->
    <div class="flex-1 p-4 flex items-center justify-between gap-4 min-w-0">
      <div class="min-w-0">
        <p class="text-[10px] text-blue-600 font-black tracking-wider uppercase mb-1">
          {{ product.category?.name }}
        </p>
        <router-link :to="`/products/${product.id}`"
          class="font-bold text-gray-800 text-sm hover:text-blue-600 line-clamp-1
                 block transition-colors">
          {{ product.name }}
        </router-link>
        <div class="mt-1">
          <span v-if="product.stock <= 0" class="text-xs text-red-500 font-medium">
            Out of stock
          </span>
          <span v-else-if="product.stock <= 10" class="text-xs text-yellow-500 font-medium">
            Only {{ product.stock }} left
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-shrink-0">
        <span class="font-black text-gray-900">
          ${{ Number(product.price).toFixed(2) }}
        </span>
        <button
          @click="$emit('add-to-cart', product)"
          :disabled="product.stock <= 0"
          type="button"
          class="text-white text-xs font-bold px-4 py-2 rounded-xl transition-all
                 flex items-center gap-1.5 shadow-sm active:scale-[0.97]"
          :class="product.stock <= 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'">
          <ShoppingCartIcon class="w-3.5 h-3.5 stroke-[2.5]" />
          Add to Cart
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { CubeIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { imageUrl } from '@/api/axios'

defineProps({
    product: { type: Object, required: true },
})

defineEmits(['add-to-cart'])
</script>
