<template>
  <div class="text-center py-20 bg-white border border-gray-100 rounded-2xl">
    <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
      <ClipboardDocumentListIcon class="w-7 h-7 text-gray-300" />
    </div>
    <h3 class="font-semibold text-gray-700 text-base">No orders yet</h3>
    <p class="text-sm text-gray-400 mt-1">Your orders will show up here once you place one.</p>
    <router-link
      to="/products"
      class="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
    >
      <ShoppingBagIcon class="w-4 h-4" />
      Browse Products
    </router-link>
  </div>
</template>

<script setup>
import { ClipboardDocumentListIcon, ShoppingBagIcon } from '@heroicons/vue/24/outline'
</script>
