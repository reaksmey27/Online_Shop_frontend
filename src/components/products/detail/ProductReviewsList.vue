<template>
  <div class="space-y-6">
    <div v-if="!reviews || reviews.length === 0" class="text-sm font-medium text-gray-400 py-4">
      No reviews documented on this product database reference record entry yet.
    </div>
    
    <div v-else class="divide-y divide-gray-100 max-w-2xl">
      <div v-for="review in reviews" :key="review.id" class="py-5 first:pt-0 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-sm font-bold text-gray-800">
            {{ review.user?.name || 'Anonymous Customer' }}
          </p>
          <span class="text-[11px] text-gray-400 font-medium">
            {{ formatDate(review.created_at) }}
          </span>
        </div>

        <div class="flex items-center gap-0.5 text-amber-400">
          <StarIcon v-for="n in 5" :key="n" class="w-3.5 h-3.5" :class="n <= review.rating ? 'fill-current' : 'text-gray-200'" />
        </div>

        <p class="text-sm text-gray-600 leading-relaxed pl-0.5">
          {{ review.comment }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/solid'

defineProps({
  reviews: { type: Array, default: () => [] }
})

function formatDate(dateStr) {
  if (!dateStr) return 'Recent'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>