<template>
  <div class="w-full lg:w-64 space-y-3">

    <!-- Shipping Address -->
    <div class="bg-white rounded-2xl border border-gray-100 p-4">
      <div class="flex items-center gap-2 mb-3">
        <MapPinIcon class="w-4 h-4 text-gray-400" />
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Shipping</h3>
      </div>
      <p class="text-sm text-gray-700 leading-relaxed">
        {{ address || 'No address provided' }}
      </p>
    </div>

    <!-- Payment -->
    <div class="bg-white rounded-2xl border border-gray-100 p-4">
      <div class="flex items-center gap-2 mb-3">
        <CreditCardIcon class="w-4 h-4 text-gray-400" />
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Payment</h3>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">Method</span>
          <span class="text-xs font-semibold text-gray-700 capitalize">{{ paymentMethod || '—' }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">Status</span>
          <span
            class="text-xs font-semibold capitalize"
            :class="{
              'text-green-600': paymentStatus === 'paid',
              'text-red-500':   paymentStatus === 'refunded',
              'text-amber-500': paymentStatus === 'unpaid',
            }"
          >
            {{ paymentStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- Order Notes -->
    <div v-if="orderNotes" class="bg-white rounded-2xl border border-gray-100 p-4">
      <div class="flex items-center gap-2 mb-2">
        <PencilSquareIcon class="w-4 h-4 text-gray-400" />
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Notes</h3>
      </div>
      <p class="text-xs text-gray-600 leading-relaxed italic">{{ orderNotes }}</p>
    </div>

    <!-- Progress tracker -->
    <div class="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Progress</h3>

      <!-- Cancelled -->
      <div v-if="isCancelled" class="flex items-center gap-2.5 text-sm text-red-500 font-medium">
        <div class="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
          <XCircleIcon class="w-4 h-4" />
        </div>
        Order Cancelled
      </div>

      <!-- Steps -->
      <div v-else class="space-y-0">
        <div
          v-for="(step, i) in STATUS_STEPS"
          :key="step.value"
          class="flex items-start gap-3"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
              :class="
                isStepComplete(step.value)
                  ? 'bg-blue-600'
                  : isCurrentStep(step.value)
                    ? 'bg-blue-100 ring-2 ring-blue-300 ring-offset-1'
                    : 'bg-gray-100'
              "
            >
              <CheckIcon
                v-if="isStepComplete(step.value)"
                class="w-3 h-3 text-white stroke-[3]"
              />
              <span
                v-else
                class="w-1.5 h-1.5 rounded-full"
                :class="isCurrentStep(step.value) ? 'bg-blue-500' : 'bg-gray-300'"
              />
            </div>
            <div
              v-if="i < STATUS_STEPS.length - 1"
              class="w-px h-5 my-1 transition-colors"
              :class="isStepComplete(step.value) ? 'bg-blue-200' : 'bg-gray-100'"
            />
          </div>

          <div class="pt-0.5 pb-4">
            <p
              class="text-xs leading-tight"
              :class="
                isStepComplete(step.value) || isCurrentStep(step.value)
                  ? 'font-semibold text-gray-800'
                  : 'text-gray-400'
              "
            >
              {{ step.label }}
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  MapPinIcon, CreditCardIcon, CheckIcon,
  XCircleIcon, PencilSquareIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  address:       { type: String, default: '' },
  paymentMethod: { type: String, default: '' },
  paymentStatus: { type: String, default: '' },
  currentStatus: { type: String, default: '' },
  orderNotes:    { type: String, default: '' },
})

const STATUS_STEPS = [
  { value: 'pending',    label: 'Order Placed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped' },
  { value: 'delivered',  label: 'Delivered' },
  { value: 'completed',  label: 'Completed' },
]

const STEP_ORDER = STATUS_STEPS.map(s => s.value)
const isCancelled = computed(() => props.currentStatus === 'cancelled')

function isStepComplete(stepValue) {
  return STEP_ORDER.indexOf(stepValue) < STEP_ORDER.indexOf(props.currentStatus)
}

function isCurrentStep(stepValue) {
  return props.currentStatus === stepValue
}
</script>
