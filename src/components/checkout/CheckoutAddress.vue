<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
    <h2 class="font-black text-gray-900 text-base flex items-center gap-2">
      <MapPinIcon class="w-5 h-5 text-blue-600" />
      Shipping Address
    </h2>
    <div>
      <textarea
        v-model="address"
        rows="3"
        placeholder="Enter your full shipping address destination..."
        class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 resize-none transition-all text-gray-800"
        :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-500/5': error }"
      />
      <p v-if="error" class="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline'

defineProps({
  error: { type: String, default: "" }
})

const address = defineModel({ type: String, default: "" })
</script>