<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 tracking-tight">
      <LockClosedIcon class="w-4 h-4 text-blue-600" />
      Change Password
    </h3>

    <div v-if="success" class="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2 font-medium">
      <CheckCircleIcon class="w-4 h-4 shrink-0 text-green-600" />
      Password changed successfully!
    </div>

    <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-medium">
      {{ error }}
    </div>

    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <div>
        <label class="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Current Password</label>
        <div class="relative">
          <input 
            v-model="form.current_password"
            :type="showCurrent ? 'text' : 'password'"
            required 
            placeholder="Current password"
            class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-800"
          >
          <button 
            type="button" 
            @click="showCurrent = !showCurrent"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          >
            <EyeSlashIcon v-if="showCurrent" class="w-4 h-4" />
            <EyeIcon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label class="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">New Password</label>
        <div class="relative">
          <input 
            v-model="form.password"
            :type="showNew ? 'text' : 'password'"
            required 
            placeholder="Min 6 characters"
            class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-800"
          >
          <button 
            type="button" 
            @click="showNew = !showNew"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
          >
            <EyeSlashIcon v-if="showNew" class="w-4 h-4" />
            <EyeIcon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label class="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Confirm New Password</label>
        <input 
          v-model="form.password_confirmation"
          type="password" 
          required 
          placeholder="Repeat new password"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-800"
          :class="mismatch ? 'border-red-400 focus:border-red-500 focus:ring-red-500/5' : ''"
        >
        <p v-if="mismatch" class="text-red-500 text-xs font-semibold mt-1.5">
          Passwords do not match
        </p>
      </div>

      <button 
        type="submit"
        :disabled="loading || mismatch"
        class="px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 text-white cursor-pointer shadow-sm"
        :class="loading || mismatch ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10'"
      >
        <span v-if="loading">Changing...</span>
        <span v-else class="flex items-center gap-2">
          <LockClosedIcon class="w-4 h-4" />
          Change Password
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LockClosedIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

defineProps({
  loading: { type: Boolean, default: false },
  mismatch: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

defineEmits(['submit'])

const form = defineModel('formModel', { type: Object, required: true })

const showCurrent = ref(false)
const showNew = ref(false)
</script>