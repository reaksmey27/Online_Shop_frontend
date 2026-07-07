<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block">
          <span class="text-4xl">🛒</span>
          <h1 class="text-2xl font-black text-gray-900 mt-2 tracking-tight">Online Shop</h1>
        </router-link>
        <p class="text-gray-400 mt-1">Sign in to your account</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <LoginForm @success="handleSuccess" />
      </div>

      <!-- Register Link -->
      <p class="text-center mt-4 text-sm text-gray-500">
        Don't have an account?
        <router-link to="/register"
          class="text-blue-600 font-bold hover:underline">
          Create one
        </router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const route  = useRoute()
const router = useRouter()

function handleSuccess() {
    router.push(route.query.redirect ? String(route.query.redirect) : { name: 'home' })
}
</script>
