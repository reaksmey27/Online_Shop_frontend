<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
    <h2 class="font-black text-gray-900 text-base flex items-center gap-2">
      <CreditCardIcon class="w-5 h-5 text-blue-600" />
      Payment Method
    </h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button
        v-for="method in PAYMENT_METHODS"
        :key="method.value"
        type="button"
        @click="activeMethod = method.value"
        class="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left group active:scale-[0.99]"
        :class="activeMethod === method.value
          ? 'border-blue-600 bg-blue-50/50 text-blue-700'
          : 'border-gray-100 bg-white hover:border-gray-200 text-gray-700'"
      >
        <component 
          :is="method.icon"
          class="w-5 h-5 shrink-0 transition-colors"
          :class="activeMethod === method.value ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" 
        />
        <span class="font-bold text-sm tracking-tight">{{ method.label }}</span>
      </button>
    </div>
    
    <p v-if="error" class="text-red-500 text-xs font-bold mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { CreditCardIcon, BanknotesIcon, DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'

defineProps({
  error: { type: String, default: "" }
})

const activeMethod = defineModel({ type: String, default: "cash" })

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash on Delivery', icon: BanknotesIcon },
  { value: 'card', label: 'Credit / Debit', icon: CreditCardIcon },
  { value: 'mobile', label: 'Mobile Pay', icon: DevicePhoneMobileIcon },
]
</script>