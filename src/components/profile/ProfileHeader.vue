<template>
  <div class="flex items-center gap-4 mb-6">
    <div class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl select-none shrink-0 shadow-sm shadow-blue-600/10">
      {{ initials }}
    </div>
    <div>
      <h2 class="font-black text-gray-900 text-lg leading-tight">{{ name || 'Account Member' }}</h2>
      <p class="text-sm text-gray-400 font-medium mt-0.5">{{ email }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  email: { type: String, default: '' }
})

const initials = computed(() => {
  return props.name ? props.name.charAt(0).toUpperCase() : 'U'
})
</script>