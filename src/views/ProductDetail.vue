<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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

      <div v-if="relatedProducts.length > 0" class="pt-12 border-t border-gray-200/80">
        <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-6">Related Products</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCard
            v-for="p in relatedProducts"
            :key="p.id"
            :product="p"
            @add-to-cart="addRelatedToCart"
          />
        </div>
      </div>

      <div class="pt-12 border-t border-gray-200/80">
        <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-8 flex items-center gap-3">
          Customer Reviews
          <span class="text-sm font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
            {{ reviewData.total ?? product.reviews?.length ?? 0 }}
          </span>
          <span v-if="reviewData.average_rating" class="text-sm font-semibold text-amber-500 flex items-center gap-1">
            ★ {{ reviewData.average_rating }}
          </span>
        </h2>

        <ProductReviewForm
          :form-model="reviewForm"
          :is-logged-in="auth.isLoggedIn"
          :can-review="canReview"
          :loading="reviewLoading"
          :success="reviewSuccess"
          :error="reviewError"
          @submit="submitReview"
        />

        <ProductReviewsList :reviews="reviewData.reviews ?? product.reviews" />
      </div>
    </div>

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

    <ToastNotification ref="toast" />
  </div>

</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import cartService    from '@/services/cartService'
import productService from '@/services/productService'
import wishlistService from '@/services/wishlistService'
import orderService   from '@/services/orderService'
import reviewService  from '@/services/reviewService'
import { CubeIcon } from '@heroicons/vue/24/outline'

import ProductMedia       from '@/components/products/detail/ProductMedia.vue'
import ProductMeta        from '@/components/products/detail/ProductMeta.vue'
import ProductReviewForm  from '@/components/products/detail/ProductReviewForm.vue'
import ProductReviewsList from '@/components/products/detail/ProductReviewsList.vue'
import ProductCard        from '@/components/products/ProductCard.vue'
import ToastNotification  from '@/components/common/Toastnotification.vue'

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const cartStore = useCartStore()
const toast  = ref(null)

const product        = ref(null)
const loading        = ref(true)
const qty            = ref(1)
const cartLoading    = ref(false)
const successMsg     = ref('')
const inWishlist     = ref(false)
const wishlistItemId = ref(null)
const canReview      = ref(false)
const reviewData     = ref({})
const relatedProducts = ref([])

const reviewForm    = ref({ rating: 0, title: '', comment: '' })
const reviewLoading = ref(false)
const reviewSuccess = ref(false)
const reviewError   = ref('')

let isMounted = true

async function fetchProduct() {
  loading.value = true
  try {
    const [productRes, reviewsRes] = await Promise.all([
      productService.getProduct(route.params.id),
      reviewService.getReviews(route.params.id),
    ])

    if (!isMounted) return

    product.value    = productRes
    reviewData.value = reviewsRes
  } catch {
    if (isMounted) product.value = null
  } finally {
    if (isMounted) loading.value = false
  }

  // Safe execution checks for background requests
  if (auth.isLoggedIn && product.value) {
    wishlistService.getWishlist().then(data => {
      if (!isMounted || !product.value) return
      const match = (data ?? []).find(w => w.product_id === product.value.id)
      inWishlist.value     = !!match
      wishlistItemId.value = match?.id ?? null
    }).catch(() => {})

    orderService.getOrders().then(data => {
      if (!isMounted || !product.value) return
      const hasDelivered = (data ?? []).some(order =>
        ['delivered', 'completed'].includes(order.status) &&
        order.items?.some(item => item.product_id === product.value.id)
      )
      const alreadyReviewed = (reviewData.value?.reviews ?? []).some(
        r => r.user_id === auth.user?.id
      )
      canReview.value = hasDelivered && !alreadyReviewed
    }).catch(() => {})
  }

  if (product.value) {
    productService.getRelated(route.params.id).then(data => {
      if (!isMounted) return
      relatedProducts.value = data ?? []
    }).catch(() => {})
  }
}

function increaseQty() {
  if (qty.value < (product.value?.stock ?? 1)) qty.value++
}

function decreaseQty() {
  if (qty.value > 1) qty.value--
}

async function addToCart(variantId = null) {
  if (!auth.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }
  cartLoading.value = true
  successMsg.value  = ''
  try {
    await cartService.addItem(product.value.id, qty.value, variantId)
    cartStore.increment(qty.value)
    successMsg.value = `${qty.value} item(s) added to your cart!`
    toast.value?.show(`${qty.value} item(s) added to cart!`, 'success')
    setTimeout(() => { if (isMounted) successMsg.value = '' }, 4000)
  } catch (e) {
    toast.value?.show(e.response?.data?.message || 'Failed to add to cart.', 'error')
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
      await wishlistService.removeItem(wishlistItemId.value)
      inWishlist.value     = false
      wishlistItemId.value = null
      toast.value?.show('Removed from wishlist', 'success')
    } else {
      const data           = await wishlistService.addItem(product.value.id)
      inWishlist.value     = true
      wishlistItemId.value = data.item?.id ?? null
      toast.value?.show('Added to wishlist', 'success')
    }
  } catch (e) {
    toast.value?.show(e.response?.data?.message || 'Wishlist update failed.', 'error')
  }
}

async function submitReview() {
  if (reviewForm.value.rating === 0) return
  reviewLoading.value = true
  reviewError.value   = ''
  reviewSuccess.value = false
  try {
    await reviewService.submitReview({
      product_id: product.value.id,
      rating:     reviewForm.value.rating,
      title:      reviewForm.value.title,
      comment:    reviewForm.value.comment,
    })
    reviewSuccess.value = true
    reviewForm.value    = { rating: 0, title: '', comment: '' }
    await fetchProduct()
    setTimeout(() => { if (isMounted) reviewSuccess.value = false }, 4000)
  } catch (e) {
    reviewError.value = e.response?.data?.message || 'Failed to submit review.'
  } finally {
    reviewLoading.value = false
  }
}

async function addRelatedToCart(p) {
  if (!auth.isLoggedIn) { router.push({ name: 'login' }); return }
  try {
    await cartService.addItem(p.id, 1)
    cartStore.increment(1)
    toast.value?.show(`"${p.name}" added to cart!`, 'success')
  } catch (e) {
    toast.value?.show(e.response?.data?.message || 'Failed to add to cart.', 'error')
  }
}

onMounted(() => {
  isMounted = true
  fetchProduct()
})

onBeforeUnmount(() => {
  isMounted = false
  product.value = null
  relatedProducts.value = []
  reviewData.value = {}
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    product.value        = null
    reviewData.value     = {}
    relatedProducts.value = []
    inWishlist.value     = false
    wishlistItemId.value = null
    canReview.value      = false
    qty.value            = 1
    reviewForm.value     = { rating: 0, title: '', comment: '' }
    fetchProduct()
  }
})
</script>