<template>
  <section class="max-w-7xl mx-auto px-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
        <p class="text-sm text-gray-400">Find exactly what you are looking for</p>
      </div>
      <router-link to="/products" class="text-blue-600 text-sm hover:text-blue-700 font-semibold flex items-center gap-1 group">
        View All
        <ChevronRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </router-link>
    </div>

    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      <div v-for="n in 8" :key="n" class="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
    </div>

    <div v-else-if="categories.length > 0" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      <router-link 
        v-for="cat in categories" 
        :key="cat.id" 
        :to="`/products?category_id=${cat.id}`"
        class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-center"
      >
        <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
          <img 
            v-if="cat.image_url || cat.image" 
            :src="cat.image_url || imageUrl(cat.image)" 
            :alt="cat.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            @error="e => e.target.style.display = 'none'"
          >
          <RectangleGroupIcon v-else class="w-7 h-7 text-gray-400" />
        </div>
        <div>
          <p class="font-bold text-gray-800 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">{{ cat.name }}</p>
          <p class="text-gray-400 text-[10px] mt-0.5 uppercase tracking-wider font-medium">{{ cat.products_count || 0 }} Items</p>
        </div>
      </router-link>
    </div>

    <div v-else class="bg-white rounded-2xl text-center text-gray-400 py-12 border border-dashed border-gray-100">
      <RectangleGroupIcon class="w-10 h-10 mx-auto mb-2 text-gray-300" />
      <p class="text-sm">No categories found yet.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { imageUrl } from '@/api/axios'
import { ChevronRightIcon, RectangleGroupIcon } from '@heroicons/vue/24/outline'

const categories = ref([])
const loading = ref(true)

async function fetchCategories() {
  try {
    const res = await api.get('/categories')
    categories.value = (res.data || []).slice(0, 8)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>