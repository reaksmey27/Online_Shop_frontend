<template>
  <div class="space-y-6 max-w-2xl">

    <!-- Rating Breakdown -->
    <div v-if="reviews && reviews.length > 0" class="bg-gray-50 rounded-2xl p-5 space-y-2">
      <div v-for="n in [5,4,3,2,1]" :key="n" class="flex items-center gap-3 text-xs">
        <span class="w-6 text-right font-semibold text-gray-600">{{ n }}★</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            class="bg-amber-400 h-2 rounded-full transition-all"
            :style="{ width: barWidth(n) }"
          />
        </div>
        <span class="w-6 text-gray-400 font-medium">{{ breakdown[n] ?? 0 }}</span>
      </div>
    </div>

    <!-- Sort bar -->
    <div v-if="reviews && reviews.length > 1" class="flex gap-2 flex-wrap">
      <button
        v-for="opt in sortOptions"
        :key="opt.value"
        @click="currentSort = opt.value"
        class="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
        :class="currentSort === opt.value
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!reviews || reviews.length === 0" class="text-sm font-medium text-gray-400 py-4">
      No reviews yet. Be the first to review this product!
    </div>

    <!-- Review list -->
    <div v-else class="divide-y divide-gray-100">
      <div v-for="review in sorted" :key="review.id" class="py-5 first:pt-0 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <p class="text-sm font-bold text-gray-800">
              {{ review.user?.name || 'Customer' }}
            </p>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              Verified Purchase
            </span>
          </div>
          <span class="text-[11px] text-gray-400 font-medium">
            {{ formatDate(review.created_at) }}
          </span>
        </div>

        <div class="flex items-center gap-0.5 text-amber-400">
          <StarIcon
            v-for="n in 5"
            :key="n"
            class="w-3.5 h-3.5"
            :class="n <= review.rating ? 'fill-current' : 'text-gray-200'"
          />
        </div>

        <p v-if="review.title" class="text-sm font-bold text-gray-800">{{ review.title }}</p>

        <p v-if="review.comment" class="text-sm text-gray-600 leading-relaxed">
          {{ review.comment }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  reviews:   { type: Array,  default: () => [] },
  breakdown: { type: Object, default: () => ({}) },
})

const sortOptions = [
  { value: 'latest',  label: 'Latest' },
  { value: 'highest', label: 'Highest Rating' },
  { value: 'lowest',  label: 'Lowest Rating' },
]
const currentSort = ref('latest')

const sorted = computed(() => {
  if (!props.reviews) return []
  const list = [...props.reviews]
  if (currentSort.value === 'highest') return list.sort((a, b) => b.rating - a.rating)
  if (currentSort.value === 'lowest')  return list.sort((a, b) => a.rating - b.rating)
  return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const totalReviews = computed(() => props.reviews?.length ?? 0)

function barWidth(n) {
  if (!totalReviews.value) return '0%'
  return `${((props.breakdown[n] ?? 0) / totalReviews.value) * 100}%`
}

function formatDate(dateStr) {
  if (!dateStr) return 'Recent'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
</script>
