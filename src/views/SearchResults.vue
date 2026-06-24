<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <MagnifyingGlassIcon class="w-6 h-6 text-gray-400" />
        <h1 class="text-2xl font-black tracking-tight text-gray-900">
          Search Results
        </h1>
      </div>
      <p class="text-gray-500 text-sm">
        <template v-if="query">
          Showing results for
          <span class="font-bold text-gray-900">"{{ query }}"</span>
          <template v-if="!loading">
            — <span class="font-semibold">{{ total }}</span> products found
          </template>
        </template>
        <template v-else>
          Enter a search term above to find products
        </template>
      </p>
    </div>

    <!-- No Query State -->
    <div v-if="!query"
         class="text-center py-24 border border-dashed border-gray-200 rounded-3xl bg-white">
      <MagnifyingGlassIcon class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h3 class="font-bold text-gray-500">What are you looking for?</h3>
      <p class="text-gray-400 text-sm mt-1">Use the search bar above to find products</p>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n"
           class="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse shadow-sm" />
    </div>

    <!-- Results -->
    <template v-else>

      <!-- Filters Row -->
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center
                  justify-between mb-6">

        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
            Filter:
          </span>
          <button
            @click="selectedCategory = null; fetchResults()"
            class="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            :class="!selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
            All
          </button>
          <button
            v-for="cat in categoriesInResults" :key="cat.id"
            @click="selectedCategory = cat.id; fetchResults()"
            class="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            :class="selectedCategory === cat.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
            {{ cat.name }}
          </button>
        </div>

        <!-- Sort -->
        <select v-model="sortBy" @change="fetchResults"
                class="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none
                       focus:border-blue-500 bg-white">
          <option value="created_at">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length > 0"
           class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="product in products" :key="product.id"
             class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
                    hover:shadow-md hover:border-blue-100 transition-all group flex flex-col">

          <!-- Image -->
          <router-link :to="`/products/${product.id}`"
            class="relative block bg-gray-50 overflow-hidden pt-[100%]">
            <div class="absolute inset-0 flex items-center justify-center p-4">
              <img v-if="product.image"
                   :src="imageUrl(product.image)"
                   :alt="product.name"
                   class="max-w-full max-h-full object-contain group-hover:scale-105
                          transition-transform duration-300"
                   @error="e => e.target.style.display = 'none'">
              <CubeIcon v-else class="w-16 h-16 text-gray-300 stroke-[1.5]" />
            </div>
            <div v-if="product.stock <= 0"
                 class="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span class="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          </router-link>

          <!-- Info -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <p class="text-[10px] text-blue-500 font-black tracking-wider uppercase mb-1">
                {{ product.category?.name }}
              </p>
              <!-- Highlight matching text -->
              <router-link :to="`/products/${product.id}`"
                class="font-bold text-gray-800 text-sm hover:text-blue-600 line-clamp-2
                       block leading-snug transition-colors"
                v-html="highlightQuery(product.name)" />
            </div>
            <div class="mt-3 flex items-center justify-between">
              <p class="text-blue-600 font-black text-base leading-none">
                ${{ Number(product.price).toFixed(2) }}
              </p>
              <button
                @click="addToCart(product)"
                :disabled="product.stock <= 0"
                type="button"
                class="text-white text-xs font-bold px-3 py-2 rounded-xl transition-all
                       flex items-center gap-1.5 active:scale-[0.97]"
                :class="product.stock <= 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20'">
                <ShoppingCartIcon class="w-3.5 h-3.5 stroke-[2.5]" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else
           class="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
        <MagnifyingGlassIcon class="w-14 h-14 text-gray-200 mx-auto mb-4" />
        <h3 class="font-bold text-gray-700 text-lg">
          No results for "{{ query }}"
        </h3>
        <p class="text-gray-400 text-sm mt-2">
          Try different keywords or browse our categories
        </p>
        <div class="flex gap-3 justify-center mt-6">
          <router-link to="/products"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl
                   text-sm font-bold transition-colors">
            Browse All Products
          </router-link>
          <router-link to="/categories"
            class="border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5
                   rounded-xl text-sm font-medium transition-colors">
            View Categories
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-10">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="p-2 rounded-xl border border-gray-200 transition-colors"
                :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'">
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
        <button v-for="page in visiblePages" :key="page"
                @click="changePage(page)"
                class="w-9 h-9 rounded-xl text-sm font-bold transition-colors"
                :class="page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage"
                class="p-2 rounded-xl border border-gray-200 transition-colors"
                :class="currentPage === lastPage ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'">
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api, { imageUrl } from '@/api/axios'
import {
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    CubeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const products         = ref([])
const loading          = ref(false)
const total            = ref(0)
const currentPage      = ref(1)
const lastPage         = ref(1)
const sortBy           = ref('created_at')
const selectedCategory = ref(null)

const query = computed(() => (route.query.q ?? '').trim())

const categoriesInResults = computed(() => {
    const seen = new Map()
    products.value.forEach(p => {
        if (p.category && !seen.has(p.category.id)) {
            seen.set(p.category.id, p.category)
        }
    })
    return [...seen.values()]
})

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end   = Math.min(lastPage.value, currentPage.value + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

function highlightQuery(text) {
    if (!query.value || !text) return text
    const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return text.replace(
        new RegExp(escaped, 'gi'),
        match => `<mark class="bg-yellow-100 text-yellow-800 rounded px-0.5">${match}</mark>`
    )
}

function getSortParams() {
    return {
        price_asc:  { sort: 'price',      order: 'asc' },
        price_desc: { sort: 'price',      order: 'desc' },
        name:       { sort: 'name',       order: 'asc' },
        created_at: { sort: 'created_at', order: 'desc' },
    }[sortBy.value] ?? { sort: 'created_at', order: 'desc' }
}

async function fetchResults() {
    if (!query.value) return
    loading.value = true
    try {
        const { sort, order } = getSortParams()
        const params = {
            search:   query.value,
            page:     currentPage.value,
            per_page: 12,
            sort,
            order,
        }
        if (selectedCategory.value) params.category_id = selectedCategory.value

        const res         = await api.get('/products', { params })
        products.value    = res.data.data
        total.value       = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value    = res.data.last_page
    } catch (e) {
        console.error('Search failed:', e)
    } finally {
        loading.value = false
    }
}

function changePage(page) {
    if (page < 1 || page > lastPage.value) return
    currentPage.value = page
    fetchResults()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function addToCart(product) {
    if (!auth.isLoggedIn) {
        router.push({ name: 'login' })
        return
    }
    try {
        await api.post('/cart', { product_id: product.id, quantity: 1 })
        alert(`"${product.name}" added to cart!`)
    } catch (e) {
        alert(e.response?.data?.message ?? 'Failed to add to cart.')
    }
}

watch(query, () => {
    currentPage.value    = 1
    selectedCategory.value = null
    fetchResults()
})

onMounted(fetchResults)
</script>
