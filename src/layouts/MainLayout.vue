<template>
  <div class="min-h-screen flex flex-col bg-gray-50 antialiased selection:bg-blue-500 selection:text-white">
    <TheNavbar />

    <main class="flex-1 w-full max-w-[1920px] mx-auto focus:outline-none">
      <router-view v-slot="{ Component }">
        <transition 
          name="fade" 
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from '@/components/layouts/TheNavbar.vue'
import TheFooter from '@/components/layouts/TheFooter.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>