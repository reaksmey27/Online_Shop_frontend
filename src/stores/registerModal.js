import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRegisterModalStore = defineStore('registerModal', () => {
  const isOpen     = ref(false)
  const redirectTo = ref(null)

  function open(redirect = null) {
    redirectTo.value = redirect
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    redirectTo.value = null
  }

  return { isOpen, redirectTo, open, close }
})
