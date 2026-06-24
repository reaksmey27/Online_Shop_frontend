<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">My Profile</h1>
      <p class="text-sm text-gray-400 mt-1">Manage your account information</p>
    </div>

    <div class="space-y-6">

      <!-- ── Profile Info ─────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <!-- Card Header -->
        <div class="px-6 py-5 border-b border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center
                      justify-center font-black text-xl select-none flex-shrink-0">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="font-black text-gray-900">{{ auth.user?.name }}</h2>
            <p class="text-sm text-gray-400">{{ auth.user?.email }}</p>
          </div>
        </div>

        <!-- Update Profile Form -->
        <div class="px-6 py-5">
          <h3 class="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <UserIcon class="w-4 h-4 text-blue-600" />
            Update Profile
          </h3>

          <transition name="fade">
            <div v-if="profileSuccess"
                 class="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3
                        text-sm text-green-700 flex items-center gap-2">
              <CheckCircleIcon class="w-4 h-4 flex-shrink-0" />
              Profile updated successfully!
            </div>
          </transition>

          <div v-if="profileError"
               class="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3
                      text-sm text-red-700">
            {{ profileError }}
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input v-model="profileForm.name" type="text" required
                     placeholder="Your name"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                            outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                            transition-colors bg-gray-50/50">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input v-model="profileForm.email" type="email" required
                     placeholder="your@email.com"
                     class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                            outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                            transition-colors bg-gray-50/50">
            </div>
            <button type="submit" :disabled="profileLoading"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                           text-white transition-all"
                    :class="profileLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20'">
              <svg v-if="profileLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <CheckIcon v-else class="w-4 h-4" />
              {{ profileLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>
      </div>

      <!-- ── Change Password ──────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div class="px-6 py-5 border-b border-gray-100">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <LockClosedIcon class="w-4 h-4 text-blue-600" />
            Change Password
          </h3>
        </div>

        <div class="px-6 py-5">
          <transition name="fade">
            <div v-if="passwordSuccess"
                 class="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3
                        text-sm text-green-700 flex items-center gap-2">
              <CheckCircleIcon class="w-4 h-4 flex-shrink-0" />
              Password changed successfully!
            </div>
          </transition>

          <div v-if="passwordError"
               class="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3
                      text-sm text-red-700">
            {{ passwordError }}
          </div>

          <form @submit.prevent="changePassword" class="space-y-4">

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div class="relative">
                <input v-model="passwordForm.current_password"
                       :type="showCurrent ? 'text' : 'password'"
                       required placeholder="Enter current password"
                       class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm
                              outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                              transition-colors bg-gray-50/50">
                <button type="button" @click="showCurrent = !showCurrent"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-gray-600 transition-colors">
                  <EyeSlashIcon v-if="showCurrent" class="w-4 h-4" />
                  <EyeIcon v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div class="relative">
                <input v-model="passwordForm.password"
                       :type="showNew ? 'text' : 'password'"
                       required placeholder="Min 6 characters"
                       class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm
                              outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                              transition-colors bg-gray-50/50">
                <button type="button" @click="showNew = !showNew"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                               hover:text-gray-600 transition-colors">
                  <EyeSlashIcon v-if="showNew" class="w-4 h-4" />
                  <EyeIcon v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input v-model="passwordForm.password_confirmation"
                     type="password" required placeholder="Repeat new password"
                     class="w-full px-4 py-2.5 border rounded-xl text-sm outline-none
                            focus:ring-2 transition-colors bg-gray-50/50"
                     :class="passwordMismatch
                       ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                       : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'">
              <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1.5">
                Passwords do not match.
              </p>
            </div>

            <button type="submit"
                    :disabled="passwordLoading || !!passwordMismatch"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                           text-white transition-all"
                    :class="passwordLoading || passwordMismatch
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20'">
              <svg v-if="passwordLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <LockClosedIcon v-else class="w-4 h-4" />
              {{ passwordLoading ? 'Changing...' : 'Change Password' }}
            </button>

          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import {
    UserIcon,
    LockClosedIcon,
    CheckCircleIcon,
    CheckIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/vue/24/outline'

const auth = useAuthStore()

// ── Profile ───────────────────────────────────────────────
const profileForm    = reactive({ name: '', email: '' })
const profileLoading = ref(false)
const profileSuccess = ref(false)
const profileError   = ref('')

// ── Password ──────────────────────────────────────────────
const passwordForm = reactive({
    current_password:      '',
    password:              '',
    password_confirmation: '',
})
const passwordLoading = ref(false)
const passwordSuccess = ref(false)
const passwordError   = ref('')
const showCurrent     = ref(false)
const showNew         = ref(false)

const passwordMismatch = computed(() =>
    passwordForm.password &&
    passwordForm.password_confirmation &&
    passwordForm.password !== passwordForm.password_confirmation
)

async function updateProfile() {
    profileLoading.value = true
    profileSuccess.value = false
    profileError.value   = ''
    try {
        const res = await api.put('/profile', {
            name:  profileForm.name,
            email: profileForm.email,
        })
        // Update the Pinia store so the navbar reflects the change
        auth.user = res.data.user
        localStorage.setItem('user', JSON.stringify(res.data.user))
        profileSuccess.value = true
        setTimeout(() => (profileSuccess.value = false), 3000)
    } catch (e) {
        profileError.value =
            e.response?.data?.message ?? 'Failed to update profile.'
    } finally {
        profileLoading.value = false
    }
}

async function changePassword() {
    if (passwordMismatch.value) return
    passwordLoading.value = true
    passwordSuccess.value = false
    passwordError.value   = ''
    try {
        await api.put('/profile/password', {
            current_password:      passwordForm.current_password,
            password:              passwordForm.password,
            password_confirmation: passwordForm.password_confirmation,
        })
        passwordSuccess.value = true
        Object.assign(passwordForm, {
            current_password: '', password: '', password_confirmation: ''
        })
        setTimeout(() => (passwordSuccess.value = false), 3000)
    } catch (e) {
        passwordError.value =
            e.response?.data?.message ?? 'Failed to change password.'
    } finally {
        passwordLoading.value = false
    }
}

onMounted(() => {
    profileForm.name  = auth.user?.name  ?? ''
    profileForm.email = auth.user?.email ?? ''
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }
</style>
