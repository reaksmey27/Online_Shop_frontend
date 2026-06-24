<template>
  <div 
    class="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
    :class="{ 'border-blue-200 bg-blue-50/30': isSelected }"
  >
    <input 
      type="checkbox"
      :checked="isSelected"
      @change="$emit('toggle-select', item.id)"
      class="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
    >

    <router-link :to="productLink" class="flex-shrink-0 mx-auto sm:mx-0">
      <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
        <img 
          v-if="productImage"
          :src="productImage"
          :alt="productName"
          class="w-full h-full object-cover"
          @error="handleImageError"
        >
        <CubeIcon v-else class="w-8 h-8 text-gray-300" />
      </div>
    </router-link>

    <div class="flex-1 min-w-0 text-center sm:text-left w-full">
      <p class="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
        {{ categoryName }}
      </p>
      <router-link 
        :to="productLink"
        class="font-semibold text-gray-800 text-sm hover:text-blue-600 line-clamp-1 block transition-colors"
      >
        {{ productName }}
      </router-link>
      <p class="text-gray-900 font-black text-sm mt-1">
        {{ formattedUnitPrice }}
      </p>
    </div>

    <div class="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
      <button 
        @click="$emit('update-qty', item, item.quantity - 1)"
        :disabled="item.quantity <= 1"
        class="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <MinusIcon class="w-3 h-3 stroke-[2.5]" />
      </button>
      
      <span class="px-2 text-xs font-bold text-gray-800 min-w-[32px] text-center select-none">
        {{ item.quantity }}
      </span>
      
      <button 
        @click="$emit('update-qty', item, item.quantity + 1)"
        :disabled="isMaxStockReached"
        class="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <PlusIcon class="w-3 h-3 stroke-[2.5]" />
      </button>
    </div>

    <div class="text-center sm:text-right flex-shrink-0 w-full sm:w-24">
      <p class="font-black text-gray-900 text-sm">
        {{ formattedTotalPrice }}
      </p>
    </div>

    <button 
      @click="$emit('remove', item.id)"
      class="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto"
      aria-label="Remove item"
    >
      <XMarkIcon class="w-5 h-5 stroke-[2]" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { imageUrl } from '@/api/axios'
import { CubeIcon, MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  item: { 
    type: Object, 
    required: true 
  },
  isSelected: { 
    type: Boolean, 
    default: false 
  }
})

defineEmits(['toggle-select', 'update-qty', 'remove'])

const product = computed(() => props.item?.product || {})

const productName = computed(() => product.value.name || 'Unknown Product')

const categoryName = computed(() => product.value.category?.name || 'General')

const productLink = computed(() => `/products/${product.value.id || ''}`)

const productImage = computed(() => {
  return product.value.image ? imageUrl(product.value.image) : null
})

const productPrice = computed(() => Number(product.value.price || 0))

const formattedUnitPrice = computed(() => `$${productPrice.value.toFixed(2)}`)

const formattedTotalPrice = computed(() => {
  const total = productPrice.value * (props.item?.quantity || 0)
  return `$${total.toFixed(2)}`
})

const isMaxStockReached = computed(() => {
  const stock = product.value.stock ?? 0
  return props.item.quantity >= stock
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>