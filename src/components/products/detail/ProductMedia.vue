<template>
  <div class="w-full lg:w-[440px] aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
    <img
      v-if="computedSrc"
      :src="computedSrc"
      :alt="name"
      class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      @error="handleImgError"
    >
    <CubeIcon v-else class="w-16 h-16 text-gray-300 stroke-[1.2]" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { imageUrl } from '@/api/axios'
import { CubeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  image: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  image_url: { type: String, default: '' },
  image_path: { type: String, default: '' },
  name: { type: String, default: 'Product Image' }
})

const imgFallbackError = ref(false)

const computedSrc = computed(() => {
  if (imgFallbackError.value) return null
  const fallbackRawSrc = props.image || props.imageUrl || props.image_url || props.image_path
  return fallbackRawSrc ? imageUrl(fallbackRawSrc) : null
})

function handleImgError() {
  imgFallbackError.value = true
}
</script>