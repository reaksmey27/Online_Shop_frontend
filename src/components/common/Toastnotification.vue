<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="visible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold min-w-[260px] max-w-sm"
        :class="type === 'error'
          ? 'bg-red-600 text-white'
          : 'bg-gray-900 text-white'"
      >
        <component :is="icon" class="w-5 h-5 flex-shrink-0" />
        <span>{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'

const visible = ref(false)
const message = ref('')
const type    = ref('success')
let timer     = null

const icon = computed(() =>
  type.value === 'error' ? ExclamationCircleIcon : CheckCircleIcon
)

function show(msg, toastType = 'success', duration = 3000) {
  clearTimeout(timer)
  message.value = msg
  type.value    = toastType
  visible.value = true
  timer = setTimeout(() => { visible.value = false }, duration)
}

defineExpose({ show })
</script>