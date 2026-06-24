<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h2 class="text-xl font-black text-gray-900 tracking-tight">Products</h2>
      <p class="text-xs text-gray-400 mt-0.5 font-medium">{{ total }} items found</p>
    </div>

    <div class="flex items-center gap-3 self-end sm:self-auto">
      <div 
        v-if="loading" 
        class="flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-gray-50/60 px-3 py-2 rounded-xl border border-gray-100/80 animate-pulse"
      >
        <ArrowPathIcon class="w-3.5 h-3.5 animate-spin" />
        <span>Syncing...</span>
      </div>

      <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          title="Grid View"
          @click="viewMode = 'grid'"
          class="p-2 rounded-lg transition-all cursor-pointer focus:outline-none"
          :class="viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'"
        >
          <Squares2X2Icon class="w-4 h-4" />
        </button>
        
        <button
          type="button"
          title="List View"
          @click="viewMode = 'list'"
          class="p-2 rounded-lg transition-all cursor-pointer focus:outline-none"
          :class="viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'"
        >
          <Bars3Icon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Squares2X2Icon, Bars3Icon, ArrowPathIcon } from '@heroicons/vue/24/outline'

defineProps({
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false }
})

const viewMode = defineModel('viewMode', { type: String, default: 'grid' })
</script>