<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">

      <!-- Loading -->
      <template v-if="loading">
        <div class="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full
                    animate-spin mx-auto mb-6" />
        <h2 class="text-lg font-black text-gray-900">Signing you in...</h2>
        <p class="text-sm text-gray-400 mt-1">Please wait while we complete your login</p>
      </template>

      <!-- Error -->
      <template v-else-if="error">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircleIcon class="w-8 h-8 text-red-500" />
        </div>
        <h2 class="text-lg font-black text-gray-900">Login Failed</h2>
        <p class="text-sm text-red-500 mt-1 max-w-sm mx-auto">{{ error }}</p>
        <router-link to="/login"
          class="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
          Back to Login
        </router-link>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { XCircleIcon } from '@heroicons/vue/24/outline'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const loading = ref(true)
const error   = ref('')

onMounted(async () => {
    const code = route.query.code

    if (!code) {
        error.value   = 'No authorization code received from Google.'
        loading.value = false
        return
    }

    try {
        await auth.googleCallback(code)
        // Redirect to homepage or the page the user was trying to visit
        const redirect = route.query.state ?? '/'
        router.push(redirect)
    } catch (e) {
        error.value   = e.response?.data?.message ?? 'Google login failed. Please try again.'
        loading.value = false
    }
})
</script>
