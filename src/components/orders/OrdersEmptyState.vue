<template>
  <div class="text-center py-24 border border-dashed border-gray-200 rounded-3xl bg-white">
    <ClipboardDocumentListIcon class="w-16 h-16 text-gray-200 mx-auto mb-4" />
    <h3 class="text-lg font-bold text-gray-800">No orders yet</h3>
    <p class="text-sm text-gray-400 mt-1">Start shopping to see your orders here</p>
    <router-link 
      to="/products"
      class="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
    >
      <ShoppingBagIcon class="w-4 h-4" />
      Browse Products
    </router-link>
  </div>
</template>

<script setup>
import { ClipboardDocumentListIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
</script>