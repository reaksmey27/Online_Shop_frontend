<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">All Categories</h1>
      <p class="text-gray-400 mt-1">Browse products by category</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n"
           class="bg-white rounded-2xl border border-gray-100 h-48 animate-pulse shadow-sm" />
    </div>

    <!-- Empty -->
    <div v-else-if="categories.length === 0"
         class="text-center py-24 border border-dashed border-gray-200 rounded-3xl bg-white">
      <Squares2X2Icon class="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <h3 class="font-bold text-gray-500">No categories found</h3>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <router-link
        v-for="cat in categories" :key="cat.id"
        :to="`/products?category_id=${cat.id}`"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm
               hover:shadow-md hover:border-blue-100 transition-all group
               overflow-hidden flex flex-col">

        <!-- Image -->
        <div class="h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden
                    flex items-center justify-center relative">
          <img v-if="cat.image"
               :src="imageUrl(cat.image)"
               :alt="cat.name"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
               @error="e => e.target.style.display = 'none'">
          <div v-else
               class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center
                      justify-center group-hover:scale-105 transition-transform duration-300">
            <TagIcon class="w-8 h-8 text-blue-400" />
          </div>

          <!-- Products count badge -->
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold
                      text-gray-600 px-2.5 py-1 rounded-full shadow-sm">
            {{ cat.products_count }} items
          </div>
        </div>

        <!-- Info -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-black text-gray-900 tracking-tight group-hover:text-blue-600
                       transition-colors">
              {{ cat.name }}
            </h3>
            <p v-if="cat.description"
               class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {{ cat.description }}
            </p>
          </div>
          <div class="flex items-center gap-1 mt-3 text-blue-600 text-xs font-bold
                      group-hover:gap-2 transition-all">
            Browse
            <ArrowRightIcon class="w-3 h-3" />
          </div>
        </div>
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { imageUrl } from '@/api/axios'
import {
    Squares2X2Icon,
    TagIcon,
    ArrowRightIcon,
} from '@heroicons/vue/24/outline'

const categories = ref([])
const loading    = ref(true)

async function fetchCategories() {
    loading.value = true
    try {
        const res        = await api.get('/categories')
        categories.value = res.data
    } catch (e) {
        console.error('Failed to load categories:', e)
    } finally {
        loading.value = false
    }
}

onMounted(fetchCategories)
</script>
