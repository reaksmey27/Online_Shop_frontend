<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <!-- Loading Skeleton -->
    <div v-if="loading" class="flex flex-col md:flex-row gap-12 animate-pulse">
      <div class="w-full md:w-[440px] aspect-square bg-gray-100 rounded-2xl shrink-0" />
      <div class="flex-1 space-y-6 py-2">
        <div class="h-4 bg-gray-100 rounded w-1/4" />
        <div class="h-10 bg-gray-100 rounded w-2/3" />
        <div class="space-y-2 pt-4">
          <div class="h-4 bg-gray-100 rounded w-full" />
          <div class="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
    </div>

    <!-- Product Found -->
    <div v-else-if="product" class="space-y-16">
      <div class="flex flex-col lg:flex-row gap-12 items-start">
        <ProductMedia :image="product.image" :name="product.name" />

        <ProductMeta
          :product="product"
          :qty="qty"
          :cart-loading="cartLoading"
          :in-wishlist="inWishlist"
          :success-msg="successMsg"
          @increment="increaseQty"
          @decrement="decreaseQty"
          @add-to-cart="addToCart"
          @toggle-wishlist="toggleWishlist"
        />
      </div>

      <!-- Reviews -->
      <div class="pt-12 border-t border-gray-200/80">
        <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
          Customer Reviews
          <span class="text-sm font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {{ product.reviews?.length ?? 0 }}
          </span>
        </h2>

        <ProductReviewForm
          v-model:formModel="reviewForm"
          :is-logged-in="auth.isLoggedIn"
          :loading="reviewLoading"
          :success="reviewSuccess"
          :error="reviewError"
          @submit="submitReview"
        />

        <ProductReviewsList :reviews="product.reviews" />
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-24 max-w-md mx-auto">
      <div class="w-16 h-16 bg-gray-50 border border-gray-100 text-gray-400 rounded-2xl
                  flex items-center justify-center mx-auto mb-4">
        <CubeIcon class="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 class="text-gray-900 font-black text-lg tracking-tight">Product not found</h3>
      <router-link to="/products"
        class="mt-6 inline-flex items-center bg-gray-900 text-white px-5 py-2.5 rounded-xl
               text-xs font-bold uppercase tracking-wider">
        Back to Products
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import { CubeIcon } from '@heroicons/vue/24/outline'

import ProductMedia       from '@/components/products/detail/ProductMedia.vue'
import ProductMeta        from '@/components/products/detail/ProductMeta.vue'
import ProductReviewForm  from '@/components/products/detail/ProductReviewForm.vue'
import ProductReviewsList from '@/components/products/detail/ProductReviewsList.vue'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()

const product      = ref(null)
const loading      = ref(true)
const qty          = ref(1)
const cartLoading  = ref(false)
const successMsg   = ref('')
const inWishlist   = ref(false)
const wishlistItemId = ref(null)

const reviewForm    = ref({ rating: 0, comment: '' })
const reviewLoading = ref(false)
const reviewSuccess = ref(false)
const reviewError   = ref('')

async function fetchProduct() {
    loading.value = true
    try {
        const requests = [api.get(`/products/${route.params.id}`)]

        if (auth.isLoggedIn) {
            requests.push(api.get('/wishlist'))
        }

        const [productRes, wishlistRes] = await Promise.all(requests)

        product.value = productRes.data

        if (wishlistRes) {
            const match = (wishlistRes.data ?? []).find(
                w => w.product_id === productRes.data.id
            )
            inWishlist.value   = !!match
            wishlistItemId.value = match?.id ?? null
        }
    } catch (e) {
        product.value = null
    } finally {
        loading.value = false
    }
}

function increaseQty() {
    if (qty.value < (product.value?.stock ?? 1)) qty.value++
}

function decreaseQty() {
    if (qty.value > 1) qty.value--
}

async function addToCart() {
    if (!auth.isLoggedIn) {
        router.push({ name: 'login' })
        return
    }
    cartLoading.value = true
    successMsg.value  = ''
    try {
        await api.post('/cart', {
            product_id: product.value.id,
            quantity:   qty.value,
        })

        successMsg.value = `${qty.value} item(s) added to your cart!`
        setTimeout(() => (successMsg.value = ''), 4000)
    } catch (e) {
        alert(e.response?.data?.message || 'Failed to add to cart.')
    } finally {
        cartLoading.value = false
    }
}

async function toggleWishlist() {
    if (!auth.isLoggedIn) {
        router.push({ name: 'login' })
        return
    }
    try {
        if (inWishlist.value) {
            await api.delete(`/wishlist/${wishlistItemId.value}`)
            inWishlist.value     = false
            wishlistItemId.value = null
        } else {
            const res            = await api.post('/wishlist', { product_id: product.value.id })
            inWishlist.value     = true
            wishlistItemId.value = res.data.item?.id ?? null
        }
    } catch (e) {
        console.error('Wishlist toggle failed:', e)
    }
}

async function submitReview() {
    if (reviewForm.value.rating === 0) return
    reviewLoading.value = true
    reviewError.value   = ''
    reviewSuccess.value = false
    try {
        await api.post('/reviews', {
            product_id: product.value.id,
            rating:     reviewForm.value.rating,
            comment:    reviewForm.value.comment,
        })
        reviewSuccess.value = true
        reviewForm.value    = { rating: 0, comment: '' }
        await fetchProduct()
        setTimeout(() => (reviewSuccess.value = false), 4000)
    } catch (e) {
        reviewError.value = e.response?.data?.message || 'Failed to submit review.'
    } finally {
        reviewLoading.value = false
    }
}

onMounted(fetchProduct)
</script>
