<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">My Wishlist</h1>
      <p class="text-sm text-gray-400 mt-1">Products you saved for later</p>
    </div>

    <!-- Toast notification -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
                  flex items-center gap-2"
           :class="toast.type === 'success'
             ? 'bg-green-600 text-white'
             : 'bg-red-600 text-white'">
        <CheckCircleIcon v-if="toast.type === 'success'" class="w-4 h-4" />
        <ExclamationCircleIcon v-else class="w-4 h-4" />
        {{ toast.message }}
      </div>
    </transition>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div v-for="n in 4" :key="n"
           class="bg-white border border-gray-100 rounded-2xl h-80 animate-pulse shadow-sm" />
    </div>

    <!-- Empty -->
    <div v-else-if="items.length === 0"
         class="text-center py-24 border border-dashed border-gray-200 rounded-3xl
                bg-white max-w-xl mx-auto px-6">
      <div class="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center
                  justify-center mx-auto mb-4 text-gray-300">
        <HeartIcon class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-black text-gray-800 tracking-tight">Your wishlist is empty</h3>
      <p class="text-sm text-gray-400 mt-1">Save products you love to buy later</p>
      <router-link to="/products"
        class="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
               px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm
               shadow-blue-600/10 active:scale-[0.99]">
        <ShoppingBagIcon class="w-4 h-4 stroke-[2.5]" />
        Browse Products
      </router-link>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div v-for="item in items" :key="item.id"
           class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
                  hover:shadow-md hover:border-gray-200/80 transition-all group flex flex-col">

        <!-- Image -->
        <router-link :to="`/products/${item.product?.id}`"
          class="relative block bg-gray-50/50 overflow-hidden pt-[100%] border-b border-gray-50">
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <img v-if="item.product?.image"
                 :src="imageUrl(item.product.image)"
                 :alt="item.product.name"
                 class="max-w-full max-h-full object-contain group-hover:scale-105
                        transition-transform duration-300"
                 @error="e => e.target.style.opacity = '0'">
            <CubeIcon v-else class="w-12 h-12 text-gray-300 stroke-[1.5]" />
          </div>
        </router-link>

        <!-- Info -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <p class="text-[10px] text-blue-600 font-black tracking-wider uppercase mb-1">
              {{ item.product?.category?.name ?? 'General' }}
            </p>
            <router-link :to="`/products/${item.product?.id}`"
              class="font-bold text-gray-800 text-sm hover:text-blue-600 line-clamp-2
                     block leading-snug tracking-tight transition-colors">
              {{ item.product?.name }}
            </router-link>
            <p class="text-gray-900 font-black text-base mt-2">
              ${{ Number(item.product?.price ?? 0).toFixed(2) }}
            </p>
          </div>

          <div class="flex gap-2 mt-4">
            <button @click="addToCart(item.product)"
                    type="button"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold
                           py-2.5 rounded-xl transition-all flex items-center justify-center
                           gap-1.5 shadow-sm shadow-blue-600/10 active:scale-[0.98]">
              <ShoppingCartIcon class="w-4 h-4 stroke-[2.2]" />
              Add to Cart
            </button>
            <button @click="removeFromWishlist(item.id)"
                    type="button"
                    title="Remove from Wishlist"
                    class="p-2.5 rounded-xl border border-gray-200 text-red-400
                           hover:bg-red-50 hover:border-red-200 hover:text-red-500
                           transition-all active:scale-[0.95]">
              <TrashIcon class="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { imageUrl } from '@/api/axios'
import {
    HeartIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    CubeIcon,
    TrashIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const items   = ref([])
const loading = ref(true)

const toast = ref({ show: false, message: '', type: 'success' })

function showToast(message, type = 'success') {
    toast.value = { show: true, message, type }
    setTimeout(() => (toast.value.show = false), 3000)
}

async function fetchWishlist() {
    loading.value = true
    try {
        const res   = await api.get('/wishlist')
        items.value = res.data
    } catch (e) {
        console.error('Failed to load wishlist:', e)
    } finally {
        loading.value = false
    }
}

async function removeFromWishlist(id) {
    try {
        await api.delete(`/wishlist/${id}`)
        items.value = items.value.filter(i => i.id !== id)
        showToast('Removed from wishlist')
    } catch (e) {
        showToast('Failed to remove item', 'error')
    }
}

async function addToCart(product) {
    if (!product) return
    try {
        await api.post('/cart', { product_id: product.id, quantity: 1 })
        showToast(`"${product.name}" added to cart!`)
    } catch (e) {
        showToast(e.response?.data?.message ?? 'Failed to add to cart', 'error')
    }
}

onMounted(fetchWishlist)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
