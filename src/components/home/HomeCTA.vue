<template>
  <section v-if="!isLoggedIn" class="max-w-7xl mx-auto px-6">
    <div class="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden shadow-xl shadow-blue-900/10">
      
      <div class="absolute -top-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div class="absolute -bottom-12 -right-12 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div class="max-w-xl mx-auto relative z-10 space-y-4">
        <h2 class="text-3xl font-extrabold tracking-tight md:text-4xl">
          Start Shopping Today
        </h2>
        <p class="text-blue-100 font-light leading-relaxed">
          Create a free account right away and enjoy instant access to your personalized wishlist, shopping cart tracking, and history management.
        </p>
        <div class="pt-4">
          <router-link 
            to="/register"
            class="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-2 text-sm"
          >
            <UserPlusIcon class="w-5 h-5 text-blue-600" />
            Create Free Account
          </router-link>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { UserPlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  isLoggedIn: { 
    type: Boolean, 
    default: false 
  }
})
</script>