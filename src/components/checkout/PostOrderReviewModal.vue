<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Modal -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          leave-active-class="transition duration-200 ease-in"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <!-- Header -->
            <div class="bg-gradient-to-r from-amber-400 to-orange-500 px-6 pt-8 pb-6 text-white text-center relative">
              <button
                @click="handleClose"
                class="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>

              <!-- All done state -->
              <template v-if="allDone">
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon class="w-8 h-8 text-white" />
                </div>
                <h2 class="text-xl font-black tracking-tight">All Reviews Submitted!</h2>
                <p class="text-amber-100 text-sm mt-1">Thanks for helping the community</p>
              </template>

              <!-- Normal state -->
              <template v-else>
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <StarIcon class="w-8 h-8 text-white fill-white" />
                </div>
                <h2 class="text-xl font-black tracking-tight">Rate Your Purchase</h2>
                <!-- Progress dots for multiple products -->
                <div v-if="products.length > 1" class="flex items-center justify-center gap-1.5 mt-3">
                  <div
                    v-for="(_, i) in products" :key="i"
                    class="rounded-full transition-all duration-300"
                    :class="i < currentIndex
                      ? 'w-2 h-2 bg-white/40'
                      : i === currentIndex
                        ? 'w-5 h-2 bg-white'
                        : 'w-2 h-2 bg-white/25'"
                  />
                </div>
                <p v-if="products.length > 1" class="text-amber-100 text-xs mt-2">
                  {{ currentIndex + 1 }} of {{ products.length }}
                </p>
              </template>
            </div>

            <!-- Body -->
            <div class="p-6">

              <!-- All done -->
              <div v-if="allDone" class="text-center py-4">
                <p class="text-gray-500 text-sm">Your feedback helps other customers make great decisions.</p>
                <button
                  @click="handleClose"
                  class="mt-5 px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>

              <!-- Submitted for current product -->
              <div v-else-if="submitted" class="text-center py-2">
                <CheckCircleIcon class="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 class="font-black text-gray-900">Review submitted!</h3>
                <p class="text-gray-500 text-sm mt-1">
                  {{ hasMore ? 'Ready to review the next item?' : 'Thanks for your feedback.' }}
                </p>
                <div class="flex gap-3 justify-center mt-5">
                  <button
                    v-if="hasMore"
                    @click="nextProduct"
                    class="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-black transition-colors"
                  >
                    <ArrowRightIcon class="w-4 h-4" />
                    Review Next Item
                  </button>
                  <button
                    @click="hasMore ? skipRemaining() : handleClose()"
                    class="px-5 py-2.5 text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {{ hasMore ? 'Skip Remaining' : 'Done' }}
                  </button>
                </div>
              </div>

              <template v-else>
                <!-- Current product display -->
                <div class="flex items-center gap-3 mb-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div class="w-12 h-12 rounded-xl bg-white border border-amber-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      v-if="currentProduct?.image"
                      :src="imageUrl(currentProduct.image)"
                      :alt="currentProduct.name"
                      class="w-full h-full object-cover"
                      @error="e => e.target.style.opacity='0'"
                    />
                    <CubeIcon v-else class="w-6 h-6 text-gray-300" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm text-gray-800 line-clamp-1">{{ currentProduct?.name }}</p>
                    <p class="text-xs text-amber-600 mt-0.5 font-medium">Share your experience</p>
                  </div>
                </div>

                <!-- Review Form -->
                <div class="space-y-4">
                  <!-- Error -->
                  <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-medium">
                    {{ errorMsg }}
                  </div>

                  <!-- Stars -->
                  <div>
                    <label class="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Your Rating *</label>
                    <div class="flex gap-1.5">
                      <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        @click="form.rating = star"
                        @mouseover="hovered = star"
                        @mouseleave="hovered = 0"
                        class="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <StarIcon
                          class="w-8 h-8 transition-colors"
                          :class="star <= (hovered || form.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'"
                        />
                      </button>
                      <span v-if="form.rating" class="ml-2 text-sm font-bold text-gray-600 self-center">
                        {{ ratingLabel }}
                      </span>
                    </div>
                  </div>

                  <!-- Comment -->
                  <div>
                    <label class="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Review (optional)</label>
                    <textarea
                      v-model="form.comment"
                      rows="3"
                      placeholder="Tell others what you liked or didn't like..."
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                    />
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-3 pt-1">
                    <button
                      @click="submitReview"
                      :disabled="submitting || form.rating === 0"
                      class="flex-1 py-3 rounded-xl text-sm font-black text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                      :class="submitting || form.rating === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20'"
                    >
                      <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {{ submitting ? 'Submitting...' : 'Submit Review' }}
                    </button>
                    <button
                      @click="skipCurrent"
                      class="px-5 py-3 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {{ hasMore ? 'Skip' : 'Skip' }}
                    </button>
                  </div>

                  <!-- Skip all hint for multi-product -->
                  <p v-if="hasMore" class="text-center text-xs text-gray-400">
                    Skipping will move to the next item
                  </p>
                </div>
              </template>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { StarIcon, CheckCircleIcon, XMarkIcon, CubeIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'
import { imageUrl } from '@/api/axios'
import reviewService from '@/services/reviewService'

const props = defineProps({
  show:     { type: Boolean, default: false },
  products: { type: Array,   default: () => [] },
})

const emit = defineEmits(['close'])

// State
const currentIndex = ref(0)
const form         = ref({ rating: 0, comment: '' })
const hovered      = ref(0)
const submitting   = ref(false)
const submitted    = ref(false)
const allDone      = ref(false)
const errorMsg     = ref('')

const currentProduct = computed(() => props.products[currentIndex.value] ?? null)
const hasMore        = computed(() => currentIndex.value < props.products.length - 1)

const ratingLabel = computed(() =>
  ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][form.value.rating] ?? ''
)

// Reset everything when modal opens
watch(() => props.show, (val) => {
  if (val) {
    currentIndex.value = 0
    submitted.value    = false
    allDone.value      = false
    errorMsg.value     = ''
    hovered.value      = 0
    form.value         = { rating: 0, comment: '' }
  }
})

function resetForm() {
  form.value     = { rating: 0, comment: '' }
  errorMsg.value = ''
  hovered.value  = 0
  submitted.value = false
}

function nextProduct() {
  currentIndex.value++
  resetForm()
}

function skipCurrent() {
  if (hasMore.value) {
    nextProduct()
  } else {
    emit('close')
  }
}

function skipRemaining() {
  emit('close')
}

function handleClose() {
  emit('close')
}

async function submitReview() {
  if (!currentProduct.value || form.value.rating === 0) return
  submitting.value = true
  errorMsg.value   = ''
  try {
    await reviewService.submitReview({
      product_id: currentProduct.value.id,
      rating:     form.value.rating,
      comment:    form.value.comment || undefined,
    })
    submitted.value = true
    // If this was the last product, mark all done after a moment
    if (!hasMore.value) {
      setTimeout(() => {
        allDone.value = true
      }, 1800)
    }
  } catch (e) {
    const msg = e.response?.data?.message || ''
    // If backend says not yet received, treat as skippable rather than an error
    if (msg.toLowerCase().includes('purchased') || msg.toLowerCase().includes('received')) {
      submitted.value = true  // move on silently
    } else {
      errorMsg.value = msg || 'Failed to submit review. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>
