<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">

    <p class="text-xs text-gray-400">
      Page {{ currentPage }} of {{ totalPages }}
    </p>

    <div class="flex items-center gap-1">
      <button
        @click="$emit('go', currentPage - 1)"
        :disabled="currentPage === 1"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500
               hover:border-gray-300 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeftIcon class="w-3.5 h-3.5" />
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="page !== '...' && $emit('go', page)"
        :disabled="page === '...'"
        class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
        :class="page === currentPage
          ? 'bg-gray-900 text-white'
          : page === '...'
            ? 'text-gray-400 cursor-default'
            : 'border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'"
      >
        {{ page }}
      </button>

      <button
        @click="$emit('go', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500
               hover:border-gray-300 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRightIcon class="w-3.5 h-3.5" />
      </button>
    </div>

  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  currentPage:  { type: Number, required: true },
  totalPages:   { type: Number, required: true },
  visiblePages: { type: Array,  required: true },
})

defineEmits(['go'])
</script>