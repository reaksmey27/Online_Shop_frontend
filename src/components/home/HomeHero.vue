<template>
  <section class="relative bg-white text-slate-900 overflow-hidden min-h-[600px] flex items-center">
    <div class="absolute right-0 top-0 bottom-0 w-full md:w-1/2 hidden md:block z-0"
         style="background: radial-gradient(ellipse at 70% 40%, #dbeafe 0%, #f1f5f9 50%, #e2e8f0 100%);" />
    <div class="absolute right-0 top-0 bottom-0 w-full md:w-1/2 hidden md:block z-0 opacity-[0.03]"
         style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); background-size: 30px 30px;" />

    <div class="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-16">

      <div class="space-y-8 text-center md:text-left max-w-xl mx-auto md:mx-0">
        <div class="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          New Season Collection
        </div>

        <h1 class="text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-950 leading-[0.95]">
          Play Like a Pro.<br />
          <span class="text-blue-600">Look Like a Legend.</span>
        </h1>

        <p class="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto md:mx-0">
          Professional-grade gear built for the pitch — engineered for performance, designed for you.
        </p>

        <div class="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
          <button
            @click="goToProducts"
            class="relative inline-flex items-center gap-2.5 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Shop Now
            <i class="bi bi-bag-check text-base" />
          </button>

          <button
            @click="goToProducts"
            class="inline-flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
          >
            Explore
            <i class="bi bi-arrow-right text-sm" />
          </button>
        </div>

        <div class="pt-4 flex justify-center md:justify-start gap-8 border-t border-slate-100">
          <div v-for="stat in stats" :key="stat.label" class="text-center md:text-left">
            <div class="text-2xl font-extrabold text-slate-900">{{ stat.value }}</div>
            <div class="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="relative flex justify-center items-center h-[500px]">
        <div class="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-3xl z-0" />

        <div class="relative z-10 animate-float drop-shadow-2xl">
          <img src="/images/hero-player.png" alt="Featured Player" class="h-[450px] w-auto object-contain" />
        </div>

        <div
          v-for="(card, index) in productCards"
          :key="index"
          :class="['absolute z-20 p-3 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-400/20 hover:shadow-2xl cursor-pointer', card.position]"
          :style="{ animationDelay: `${index * 0.4}s` }"
        >
          <img :src="card.src" :alt="card.alt" class="w-16 h-16 md:w-20 md:h-20 object-contain" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function goToProducts() {
  router.push(auth.isLoggedIn ? '/products' : '/login')
}

const stats = [
  { value: '10K+', label: 'Athletes' },
  { value: '500+', label: 'Products' },
  { value: '4.9★', label: 'Rating' },
]

const productCards = [
  { src: '/images/products/jersey.png', alt: 'Jersey', position: 'top-4 right-8 md:right-16' },
  { src: '/images/products/boots1.png', alt: 'Boots', position: 'top-1/3 right-0' },
  { src: '/images/products/ball.png', alt: 'Ball', position: 'bottom-4 right-12 md:right-24' },
  { src: '/images/products/boots2.png', alt: 'Boots 2', position: 'bottom-12 left-4 md:left-8' },
]
</script>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
  will-change: transform;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-float { animation: none; }
}
</style>