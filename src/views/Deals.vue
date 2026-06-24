<template>
  <div>

    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white
                    text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
          <BoltIcon class="w-3.5 h-3.5" />
          Limited Time
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-3">
          <FireIcon class="w-10 h-10 inline-block mr-2 text-yellow-300" /> Hot Deals
        </h1>
        <p class="text-white/80 text-lg max-w-xl mx-auto">
          Unbeatable prices on our best-selling products. Grab them before they're gone!
        </p>

        <!-- Countdown Timer -->
        <div class="mt-8 flex items-center justify-center gap-3">
          <div v-for="unit in countdown" :key="unit.label"
               class="flex flex-col items-center">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center
                        justify-center text-2xl font-black tabular-nums">
              {{ unit.value }}
            </div>
            <span class="text-xs text-white/70 mt-1 uppercase tracking-wider font-medium">
              {{ unit.label }}
            </span>
          </div>
          <span class="text-white/50 text-2xl font-bold mb-5">:</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-black text-gray-900">Today's Best Deals</h2>
          <p class="text-sm text-gray-400 mt-0.5">
            <span v-if="!loading" class="font-semibold text-gray-700">{{ total }}</span>
            {{ loading ? 'Loading...' : ' deals available' }}
          </p>
        </div>
        <select v-model="sortBy" @change="fetchDeals"
                class="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="created_at">Newest First</option>
        </select>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="n in 8" :key="n"
             class="bg-white rounded-2xl border border-gray-100 h-72 animate-pulse shadow-sm" />
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0"
           class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div v-for="product in products" :key="product.id"
             class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
                    hover:shadow-md hover:border-red-100 transition-all group flex flex-col">

          <!-- Deal Badge + Image -->
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
            <!-- HOT Badge -->
            <div class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500
                        text-white text-[10px] font-black px-2.5 py-1 rounded-full
                        uppercase tracking-wider shadow-sm">
              <FireIcon class="w-3.5 h-3.5 inline-block mr-1" /> Deal
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
              <p class="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-1">
                {{ product.category?.name }}
              </p>
              <router-link :to="`/products/${product.id}`"
                class="font-bold text-gray-800 text-sm hover:text-red-600 line-clamp-2
                       block leading-snug transition-colors">
                {{ product.name }}
              </router-link>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <div>
                <p class="text-red-600 font-black text-lg leading-none">
                  ${{ Number(product.price).toFixed(2) }}
                </p>
              </div>
              <button
                @click="addToCart(product)"
                :disabled="product.stock <= 0"
                type="button"
                class="text-white text-xs font-bold px-3 py-2 rounded-xl transition-all
                       flex items-center gap-1.5 shadow-sm active:scale-[0.97]"
                :class="product.stock <= 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'">
                <ShoppingCartIcon class="w-3.5 h-3.5 stroke-[2.5]" />
                {{ product.stock <= 0 ? 'Sold Out' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
        <BoltIcon class="w-14 h-14 text-gray-200 mx-auto mb-4" />
        <p class="font-bold text-gray-500">No deals available right now</p>
        <p class="text-gray-400 text-sm mt-1">Check back soon for new offers!</p>
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
                  ? 'bg-red-500 text-white'
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastNotification from '@/components/common/ToastNotification.vue'
import api, { imageUrl } from '@/api/axios'
import {
    BoltIcon,
    ShoppingCartIcon,
    CubeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FireIcon,
} from '@heroicons/vue/24/outline'

const toast = ref(null)
const router = useRouter()
const auth   = useAuthStore()

const products    = ref([])
const loading     = ref(true)
const sortBy      = ref('price_asc')
const total       = ref(0)
const currentPage = ref(1)
const lastPage    = ref(1)

// ── Countdown Timer ───────────────────────────────────────
const now        = new Date()
const endOfDay   = new Date(now)
endOfDay.setHours(23, 59, 59, 0)

const timeLeft   = ref(Math.floor((endOfDay - now) / 1000))

const countdown = computed(() => {
    const h = Math.floor(timeLeft.value / 3600)
    const m = Math.floor((timeLeft.value % 3600) / 60)
    const s = timeLeft.value % 60
    return [
        { value: String(h).padStart(2, '0'), label: 'Hours' },
        { value: String(m).padStart(2, '0'), label: 'Mins' },
        { value: String(s).padStart(2, '0'), label: 'Secs' },
    ]
})

let timer = null
onMounted(() => {
    timer = setInterval(() => {
        if (timeLeft.value > 0) timeLeft.value--
    }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))

// ── Products ──────────────────────────────────────────────
const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end   = Math.min(lastPage.value, currentPage.value + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

function getSortParams() {
    return {
        price_asc:  { sort: 'price', order: 'asc' },
        price_desc: { sort: 'price', order: 'desc' },
        created_at: { sort: 'created_at', order: 'desc' },
    }[sortBy.value] ?? { sort: 'price', order: 'asc' }
}

async function fetchDeals() {
    loading.value = true
    try {
        const { sort, order } = getSortParams()
        const res = await api.get('/products', {
            params: {
                page:     currentPage.value,
                per_page: 12,
                sort,
                order,
            }
        })
        products.value    = res.data.data
        total.value       = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value    = res.data.last_page
    } catch (e) {
        console.error('Failed to load deals:', e)
    } finally {
        loading.value = false
    }
}

function changePage(page) {
    if (page < 1 || page > lastPage.value) return
    currentPage.value = page
    fetchDeals()
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

onMounted(fetchDeals)
</script>