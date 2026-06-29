<template>
  <div class="bg-white border border-gray-100 rounded-2xl p-6 max-w-xl shadow-sm mb-10">
    <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
      Write a Review
    </h3>

    <!-- Not logged in -->
    <div
      v-if="!isLoggedIn"
      class="p-4 bg-gray-50 rounded-xl text-center text-xs font-semibold text-gray-500"
    >
      Please
      <router-link to="/login" class="text-blue-600 hover:underline font-bold">
        sign in
      </router-link>
      to leave a review.
    </div>

    <!-- Logged in but hasn't purchased / already reviewed -->
    <div
      v-else-if="!canReview"
      class="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs font-semibold text-amber-700"
    >
      Only customers who have purchased and received this product can leave a review.
    </div>

    <form v-else @submit.prevent="$emit('submit')" class="space-y-4">

      <div
        v-if="success"
        class="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 font-medium text-sm rounded-xl"
      >
        Review submitted successfully!
      </div>

      <div
        v-if="error"
        class="p-3.5 bg-red-50 border border-red-100 text-red-700 font-medium text-sm rounded-xl"
      >
        {{ error }}
      </div>

      <!-- Star Rating -->
      <div class="flex items-center gap-1.5">
        <label class="text-xs font-black text-gray-700 uppercase tracking-wide mr-2">
          Rating
        </label>
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          @click="formModel.rating = star"
          class="hover:scale-110 transition-transform focus:outline-none"
          :class="star <= formModel.rating ? 'text-amber-400' : 'text-gray-200'"
        >
          <StarIcon class="w-5 h-5 fill-current" />
        </button>
      </div>

      <!-- Title -->
      <div>
        <input
          :value="formModel.title"
          @input="formModel.title = $event.target.value"
          type="text"
          maxlength="120"
          placeholder="Review title (optional)"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none
                 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-800"
        />
      </div>

      <!-- Comment -->
      <div>
        <textarea
          :value="formModel.comment"
          @input="formModel.comment = $event.target.value"
          rows="3"
          placeholder="Share your thoughts about this product..."
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none
                 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all
                 text-gray-800 resize-none"
        />
      </div>

      <button
        type="submit"
        :disabled="loading || formModel.rating === 0"
        class="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400
               disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider
               px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <ArrowPathIcon v-if="loading" class="w-3.5 h-3.5 animate-spin" />
        <span>{{ loading ? 'Posting...' : 'Submit Review' }}</span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { StarIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'

defineProps({
  formModel:  { type: Object,  required: true },
  isLoggedIn: { type: Boolean, default: false },
  canReview:  { type: Boolean, default: false },
  loading:    { type: Boolean, default: false },
  success:    { type: Boolean, default: false },
  error:      { type: String,  default: '' },
})

defineEmits(['submit'])
</script>
