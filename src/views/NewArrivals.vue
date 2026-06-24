<template>
  <div>

    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white
                    text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          <SparklesIcon class="w-3.5 h-3.5" />
          Just Dropped
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-3">
          <SparklesIcon class="w-10 h-10 inline-block mr-2 text-yellow-300" /> New Arrivals
        </h1>
        <p class="text-white/80 text-lg max-w-xl mx-auto">
          Discover the latest additions to our collection. Fresh styles, just landed.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-black text-gray-900">Latest Products</h2>
          <p class="text-sm text-gray-400 mt-0.5">
            <span v-if="!loading" class="font-semibold text-gray-700">{{ total }}</span>
            {{ loading ? 'Loading...' : ' new products' }}
          </p>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            @click="selectedCategory = null; fetchProducts()"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            :class="selectedCategory === null
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
            All
          </button>
          <button
            v-for="cat in categories" :key="cat.id"
            @click="selectedCategory = cat.id; fetchProducts()"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            :class="selectedCategory === cat.id
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="n in 8" :key="n"
             class="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse shadow-sm" />
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0"
           class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="(product, index) in products" :key="product.id"
             class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
                    hover:shadow-md hover:border-purple-100 transition-all group flex flex-col">

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

            <!-- NEW Badge — only on first 8 products -->
            <div v-if="index < 8"
                 class="absolute top-3 left-3 bg-gradient-to-r from-violet-600 to-purple-600
                        text-white text-[10px] font-black px-2.5 py-1 rounded-full
                        uppercase tracking-wider shadow-sm">
              <SparklesIcon class="w-3.5 h-3.5 inline-block mr-1" /> New
            </div>

            <!-- Stock Warning -->
            <div v-if="product.stock > 0 && product.stock <= 10"
                 class="absolute bottom-3 left-3 bg-yellow-500 text-white text-[10px]
                        font-black px-2 py-0.5 rounded-full">
              Only {{ product.stock }} left!
            </div>
          </router-link>

          <!-- Info -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <p class="text-[10px] text-purple-500 font-black tracking-wider uppercase mb-1">
                {{ product.category?.name }}
              </p>
              <router-link :to="`/products/${product.id}`"
                class="font-bold text-gray-800 text-sm hover:text-purple-600 line-clamp-2
                       block leading-snug transition-colors">
                {{ product.name }}
              </router-link>
              <p class="text-xs text-gray-400 mt-1">
                Added {{ timeAgo(product.created_at) }}
              </p>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <p class="text-purple-600 font-black text-lg leading-none">
                ${{ Number(product.price).toFixed(2) }}
              </p>
              <button
                @click="addToCart(product)"
                :disabled="product.stock <= 0"
                type="button"
                class="text-white text-xs font-bold px-3 py-2 rounded-xl transition-all
                       flex items-center gap-1.5 shadow-sm active:scale-[0.97]"
                :class="product.stock <= 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'">
                <ShoppingCartIcon class="w-3.5 h-3.5 stroke-[2.5]" />
                {{ product.stock <= 0 ? 'Sold Out' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
        <SparklesIcon class="w-14 h-14 text-gray-200 mx-auto mb-4" />
        <p class="font-bold text-gray-500">No new arrivals yet</p>
        <p class="text-gray-400 text-sm mt-1">Check back soon for new products!</p>
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
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage"
                class="p-2 rounded-xl border border-gray-200 transition-colors"
                :class="currentPage === lastPage ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'">
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>

    </div>
    <ToastNotification ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastNotification from '@/components/common/ToastNotification.vue'
import api, { imageUrl } from '@/api/axios'
import {
    SparklesIcon,
    ShoppingCartIcon,
    CubeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const toast = ref(null)
const router = useRouter()
const auth   = useAuthStore()

const products        = ref([])
const categories      = ref([])
const loading         = ref(true)
const total           = ref(0)
const currentPage     = ref(1)
const lastPage        = ref(1)
const selectedCategory = ref(null)

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end   = Math.min(lastPage.value, currentPage.value + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

// Show how long ago a product was added
function timeAgo(dateStr) {
    if (!dateStr) return ''
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60)      return 'just now'
    if (diff < 3600)    return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400)   return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800)  return `${Math.floor(diff / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString()
}

async function fetchProducts() {
    loading.value = true
    try {
        const params = {
            page:     currentPage.value,
            per_page: 12,
            sort:     'created_at',
            order:    'desc',
        }
        if (selectedCategory.value) params.category_id = selectedCategory.value

        const res         = await api.get('/products', { params })
        products.value    = res.data.data
        total.value       = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value    = res.data.last_page
    } catch (e) {
        console.error('Failed to load new arrivals:', e)
    } finally {
        loading.value = false
    }
}

async function fetchCategories() {
    try {
        const res        = await api.get('/categories')
        categories.value = res.data
    } catch (e) {
        console.error('Failed to load categories:', e)
    }
}

function changePage(page) {
    if (page < 1 || page > lastPage.value) return
    currentPage.value = page
    fetchProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function addToCart(product) {
    if (!auth.isLoggedIn) {
        router.push({ name: 'login' })
        return
    }
    try {
        await api.post('/cart', { product_id: product.id, quantity: 1 })
        toast.value.show(`"${product.name}" added to cart!`)
    } catch (e) {
        toast.value.show(e.response?.data?.message ?? 'Failed to add to cart.', 'error')
    }
}

onMounted(() => {
    fetchCategories()
    fetchProducts()
})
</script>