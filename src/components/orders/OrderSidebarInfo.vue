<template>
  <div class="w-full lg:w-72 space-y-4">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-black text-gray-900 mb-3 flex items-center gap-2">
        <MapPinIcon class="w-4 h-4 text-blue-600" />
        Shipping Address
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ address ?? 'No address provided' }}
      </p>
    </div>

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
          <span class="font-semibold capitalize" :class="paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'">
            {{ paymentStatus }}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-black text-gray-900 mb-4">Order Status</h3>
      <div class="space-y-3">
        <div v-for="step in STATUS_STEPS" :key="step.value" class="flex items-center gap-3">
          <div 
            class="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            :class="isStepComplete(step.value) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'"
          >
            <CheckIcon v-if="isStepComplete(step.value)" class="w-3.5 h-3.5" />
            <span v-else class="w-2 h-2 rounded-full bg-gray-300 block"></span>
          </div>
          <span class="text-sm" :class="isStepComplete(step.value) ? 'font-semibold text-gray-800' : 'text-gray-400'">
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPinIcon, CreditCardIcon, CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  address: { type: String, default: '' },
  paymentMethod: { type: String, default: '' },
  paymentStatus: { type: String, default: '' },
  currentStatus: { type: String, default: '' }
})

const STATUS_STEPS = [
  { value: 'pending', label: 'Order Placed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
]

const STEP_ORDER = ['pending', 'processing', 'shipped', 'delivered']

function isStepComplete(stepValue) {
  const currentIndex = STEP_ORDER.indexOf(props.currentStatus)
  const stepIndex = STEP_ORDER.indexOf(stepValue)
  return stepIndex <= currentIndex
}
</script>