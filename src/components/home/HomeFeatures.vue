<template>
  <section class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div 
        v-for="feature in features" 
        :key="feature.title"
        class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50/80 transition-colors duration-200 group"
      >
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200" :class="feature.bg">
          <component :is="feature.icon" class="w-6 h-6" :class="feature.color" />
        </div>
        
        <div>
          <h4 class="font-bold text-gray-800 text-sm">{{ feature.title }}</h4>
          <p class="text-gray-400 text-xs mt-0.5">{{ feature.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { TruckIcon, LockClosedIcon, ArrowPathIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

const features = [
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On orders over $50', bg: 'bg-blue-50', color: 'text-blue-500' },
  { icon: LockClosedIcon, title: 'Secure Payment', desc: '100% secure checkout', bg: 'bg-emerald-50', color: 'text-emerald-500' },
  { icon: ArrowPathIcon, title: 'Easy Returns', desc: '30-day return policy', bg: 'bg-amber-50', color: 'text-amber-500' },
  { icon: ChatBubbleLeftRightIcon, title: '24/7 Support', desc: 'We are here to help', bg: 'bg-purple-50', color: 'text-purple-500' }
]
</script>