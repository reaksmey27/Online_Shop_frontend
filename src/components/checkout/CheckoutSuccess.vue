<template>
  <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center shadow-sm">
    <CheckCircleIcon class="w-14 h-14 text-emerald-500 mx-auto mb-3" />
    <h3 class="font-black text-emerald-900 text-xl tracking-tight">Order Placed Successfully!</h3>
    <p class="text-emerald-600 text-sm mt-1 font-medium">Your purchase ledger configuration has been successfully logged.</p>
    
    <div class="flex flex-wrap gap-3 justify-center mt-6">
      <router-link to="/orders" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
        View My Orders
      </router-link>
      <router-link to="/products" class="border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
        Continue Shopping
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
</script>