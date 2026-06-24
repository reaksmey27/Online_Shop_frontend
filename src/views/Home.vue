<template>
  <div class="bg-gray-50 min-h-screen space-y-16 pb-16">
    <HomeHero     :is-logged-in="auth.isLoggedIn" />
    <HomeFeatures />
    <HomeCategories />
    <HomeProducts />
    <HomeCTA      :is-logged-in="auth.isLoggedIn" />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import HomeHero       from '@/components/home/HomeHero.vue'
import HomeFeatures   from '@/components/home/HomeFeatures.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeProducts   from '@/components/home/HomeProducts.vue'
import HomeCTA        from '@/components/home/HomeCTA.vue'

const auth = useAuthStore()
</script>
