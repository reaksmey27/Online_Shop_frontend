<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block">
          <span class="text-4xl">🛒</span>
          <h1 class="text-2xl font-black text-gray-900 mt-2 tracking-tight">Online Shop</h1>
        </router-link>
        <p class="text-gray-400 mt-1">Create your account</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <!-- Google Button -->
        <GoogleButton
          :loading="googleLoading"
          label="Sign up with Google"
          @click="handleGoogleLogin" />

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-100" />
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            or register with email
          </span>
          <div class="flex-1 h-px bg-gray-100" />
        </div>

        <!-- Error Alert -->
        <div v-if="errorMsg"
             class="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl
                    text-sm flex items-center gap-2">
          <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0" />
          {{ errorMsg }}
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">

          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              required
              autocomplete="name"
              class="w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors
                     bg-gray-50/50"
              :class="errors.name
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'">
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">
              {{ errors.name[0] }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              required
              autocomplete="email"
              class="w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors
                     bg-gray-50/50"
              :class="errors.email
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'">
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">
              {{ errors.email[0] }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min 6 characters"
                required
                autocomplete="new-password"
                class="w-full px-4 py-2.5 pr-10 border rounded-xl text-sm outline-none
                       transition-colors bg-gray-50/50"
                :class="errors.password
                  ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'">
              <button type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors">
                <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">
              {{ errors.password[0] }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div class="relative">
              <input
                v-model="form.password_confirmation"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Repeat password"
                required
                autocomplete="new-password"
                class="w-full px-4 py-2.5 pr-10 border rounded-xl text-sm outline-none
                       transition-colors bg-gray-50/50"
                :class="passwordMismatch
                  ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'">
              <button type="button"
                      @click="showConfirm = !showConfirm"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors">
                <EyeSlashIcon v-if="showConfirm" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">
              Passwords do not match.
            </p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !!passwordMismatch"
            class="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all
                   mt-2 shadow-sm active:scale-[0.99]"
            :class="loading || passwordMismatch
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'">
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>

        </form>
      </div>

      <!-- Login Link -->
      <p class="text-center mt-4 text-sm text-gray-500">
        Already have an account?
        <router-link to="/login" class="text-blue-600 font-bold hover:underline">
          Sign in
        </router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import GoogleButton from '@/components/auth/GoogleButton.vue'

const router = useRouter()
const auth   = useAuthStore()

const form = reactive({
    name:                  '',
    email:                 '',
    password:              '',
    password_confirmation: '',
})

const loading       = ref(false)
const googleLoading = ref(false)
const errorMsg      = ref('')
const errors        = ref({})
const showPassword  = ref(false)
const showConfirm   = ref(false)

const passwordMismatch = computed(() =>
    form.password &&
    form.password_confirmation &&
    form.password !== form.password_confirmation
)

// ── Email Register ────────────────────────────────────────
async function handleRegister() {
    if (passwordMismatch.value) return
    loading.value  = true
    errorMsg.value = ''
    errors.value   = {}
    try {
        await auth.register(form)
        router.push({ name: 'home' })
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors ?? {}
        } else {
            errorMsg.value =
                e.response?.data?.message ?? 'Registration failed. Please try again.'
        }
    } finally {
        loading.value = false
    }
}

// ── Google Login ──────────────────────────────────────────
async function handleGoogleLogin() {
    googleLoading.value = true
    errorMsg.value      = ''
    try {
        await auth.loginWithGoogle()
    } catch (e) {
        errorMsg.value      = 'Could not connect to Google. Please try again.'
        googleLoading.value = false
    }
}
</script>
