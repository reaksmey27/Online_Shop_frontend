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

      <!-- Promo Codes -->
      <div v-if="discounts.length > 0" class="mb-10">
        <h2 class="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <TagIcon class="w-5 h-5 text-red-500" /> Promo Codes
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="d in discounts" :key="d.id"
               class="relative bg-white border border-dashed border-red-200 rounded-2xl p-4 flex items-center gap-4 overflow-hidden">
            <div class="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500
                        text-white flex items-center justify-center font-black text-sm text-center leading-tight">
              {{ d.type === 'percentage' ? `${trimZeros(d.value)}%` : `$${trimZeros(d.value)}` }}
            </div>
            <div class="min-w-0 flex-1">
              <p v-if="d.description" class="text-xs text-gray-500 truncate">{{ d.description }}</p>
              <p v-if="d.min_order_amount" class="text-[11px] text-gray-400">
                Min. order ${{ Number(d.min_order_amount).toFixed(2) }}
              </p>
              <p v-if="d.expires_at" class="text-[11px] text-gray-400">
                Expires {{ new Date(d.expires_at).toLocaleDateString() }}
              </p>
            </div>
            <button
              type="button"
              @click="copyCode(d.code)"
              class="flex-shrink-0 flex items-center gap-1.5 border border-red-200 text-red-600
                     font-black text-xs px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              <component :is="copiedCode === d.code ? CheckIcon : ClipboardIcon" class="w-3.5 h-3.5" />
              {{ d.code }}
            </button>
          </div>
        </div>
      </div>

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
            <!-- Discount Badge -->
            <div v-if="product.discount_percent" class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500
                        text-white text-[10px] font-black px-2.5 py-1 rounded-full
                        uppercase tracking-wider shadow-sm">
              -{{ product.discount_percent }}%
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
                  ${{ Number(product.sale_price ?? product.price).toFixed(2) }}
                </p>
                <p v-if="product.is_on_sale" class="text-gray-400 text-xs line-through mt-0.5">
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
import { imageUrl } from '@/api/axios'
import productService from '@/services/productService'
import cartService from '@/services/cartService'
import discountService from '@/services/discountService'
import {
    BoltIcon,
    ShoppingCartIcon,
    CubeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    FireIcon,
    TagIcon,
    ClipboardIcon,
    CheckIcon,
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

// ── Promo Codes ────────────────────────────────────────────
const discounts  = ref([])
const copiedCode = ref(null)

function trimZeros(n) {
    return String(Number(n)).replace(/\.0+$/, '')
}

async function fetchDiscounts() {
    try {
        discounts.value = await discountService.getPublicDiscounts()
    } catch (e) {
        console.error('Failed to load promo codes:', e)
    }
}

async function copyCode(code) {
    try {
        await navigator.clipboard.writeText(code)
    } catch (e) {
        // Clipboard API unavailable — silently ignore, the code is still visible to copy manually
    }
    copiedCode.value = code
    setTimeout(() => {
        if (copiedCode.value === code) copiedCode.value = null
    }, 2000)
}

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
        const data = await productService.getProducts({
                page:     currentPage.value,
                per_page: 12,
                sort,
                order,
                on_sale:  1,
            })
        products.value    = data.data
        total.value       = data.total
        currentPage.value = data.current_page
        lastPage.value    = data.last_page
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
        await cartService.addItem(product.id, 1)
        toast.value.show(`"${product.name}" added to cart!`)
    } catch (e) {
        toast.value.show(e.response?.data?.message ?? 'Failed to add to cart.', 'error')
    }
}

onMounted(() => {
    fetchDeals()
    fetchDiscounts()
})
</script>