<template>
  <div class="w-full lg:w-72 space-y-4">

    <!-- Shipping Address -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-black text-gray-900 mb-3 flex items-center gap-2">
        <MapPinIcon class="w-4 h-4 text-blue-600" />
        Shipping Address
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ address ?? 'No address provided' }}
      </p>
    </div>

    <!-- Payment -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-black text-gray-900 mb-3 flex items-center gap-2">
        <CreditCardIcon class="w-4 h-4 text-blue-600" />
        Payment
      </h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Method</span>
          <span class="font-semibold text-gray-800 capitalize">{{ paymentMethod ?? '—' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Status</span>
          <span
            class="font-semibold capitalize"
            :class="{
              'text-green-600': paymentStatus === 'paid',
              'text-red-500':   paymentStatus === 'refunded',
              'text-yellow-600': paymentStatus === 'unpaid',
            }"
          >
            {{ paymentStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- Order Notes (if present) -->
    <div v-if="orderNotes" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-black text-gray-900 mb-2 flex items-center gap-2">
        <PencilSquareIcon class="w-4 h-4 text-blue-600" />
        Order Notes
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed italic">{{ orderNotes }}</p>
    </div>

    <!-- Status Tracker -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-black text-gray-900 mb-4">Order Progress</h3>

      <!-- Cancelled state -->
      <div v-if="isCancelled" class="flex items-center gap-3 text-sm text-red-600 font-semibold">
        <XCircleIcon class="w-5 h-5" />
        Order Cancelled
      </div>

      <!-- Normal progress -->
      <div v-else class="space-y-0">
        <div
          v-for="(step, i) in STATUS_STEPS"
          :key="step.value"
          class="flex items-start gap-3"
        >
          <!-- Icon + vertical line -->
          <div class="flex flex-col items-center">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors"
              :class="isStepComplete(step.value)
                ? 'bg-blue-600 text-white'
                : isCurrentStep(step.value)
                  ? 'bg-blue-100 border-2 border-blue-400 text-blue-500'
                  : 'bg-gray-100 text-gray-300'"
            >
              <CheckIcon v-if="isStepComplete(step.value)" class="w-3.5 h-3.5 stroke-[2.5]" />
              <span v-else class="w-2 h-2 rounded-full block"
                :class="isCurrentStep(step.value) ? 'bg-blue-400' : 'bg-gray-300'" />
            </div>
            <!-- Connecting line -->
            <div
              v-if="i < STATUS_STEPS.length - 1"
              class="w-0.5 h-6 mt-1 mb-1 transition-colors"
              :class="isStepComplete(step.value) ? 'bg-blue-200' : 'bg-gray-100'"
            />
          </div>

          <div class="pb-4 pt-1">
            <p
              class="text-sm leading-tight"
              :class="isStepComplete(step.value) || isCurrentStep(step.value)
                ? 'font-semibold text-gray-800'
                : 'text-gray-400'"
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
  const currentIdx = STEP_ORDER.indexOf(props.currentStatus)
  const stepIdx    = STEP_ORDER.indexOf(stepValue)
  return stepIdx < currentIdx
}

function isCurrentStep(stepValue) {
  return props.currentStatus === stepValue
}
</script>
