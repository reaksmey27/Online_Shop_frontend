<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 tracking-tight">
      <UserIcon class="w-4 h-4 text-blue-600" />
      Update Profile
    </h3>

    <div v-if="success" class="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2 font-medium">
      <CheckCircleIcon class="w-4 h-4 shrink-0 text-green-600" />
      Profile updated successfully!
    </div>

    <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-medium">
      {{ error }}
    </div>

    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <div>
        <label class="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
        <input 
          v-model="form.name" 
          type="text" 
          required
          placeholder="Your name"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-800"
        >
      </div>
      <div>
        <label class="block text-xs font-black text-gray-700 uppercase tracking-wide mb-1.5">Email</label>
        <input 
          v-model="form.email" 
          type="email" 
          required
          placeholder="your@email.com"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-800"
        >
      </div>
      
      <button 
        type="submit" 
        :disabled="loading"
        class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-600/10"
      >
        <span v-if="loading">Saving...</span>
        <span v-else class="flex items-center gap-2">
          <CheckIcon class="w-4 h-4 stroke-[2.5]" />
          Save Changes
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { UserIcon, CheckCircleIcon, CheckIcon } from '@heroicons/vue/24/outline'

defineProps({
  loading: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

defineEmits(['submit'])

const form = defineModel('formModel', { type: Object, required: true })
</script>