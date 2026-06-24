<template>
  <div class="mt-8 flex items-center justify-center">
    <div class="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">

      <button
        type="button"
        @click="change(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded-xl transition-all focus:outline-none cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeftIcon class="w-4 h-4 stroke-[2.5]" />
      </button>

      <div class="px-4 text-xs font-black text-gray-700 min-w-[100px] text-center select-none">
        {{ currentPage }} <span class="text-gray-400 font-normal mx-1">/</span> {{ lastPage }}
      </div>

      <button
        type="button"
        @click="change(currentPage + 1)"
        :disabled="currentPage >= lastPage"
        class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded-xl transition-all focus:outline-none cursor-pointer"
        aria-label="Next Page"
      >
        <ChevronRightIcon class="w-4 h-4 stroke-[2.5]" />
      </button>

    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline"

const emit = defineEmits(['change'])

const props = defineProps({
  lastPage: { type: Number, required: true },
})

const currentPage = defineModel('currentPage', { type: Number, required: true })

function change(page) {
  if (page < 1 || page > props.lastPage) return
  currentPage.value = page
  emit('change', page)
}
</script>
