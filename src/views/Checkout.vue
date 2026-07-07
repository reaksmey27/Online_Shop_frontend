<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">Checkout</h1>
      <p class="text-sm text-gray-400 mt-1">Complete your order</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="bg-gray-100 h-40 rounded-2xl" />
      <div class="bg-gray-100 h-64 rounded-2xl" />
    </div>

    <!-- Empty Cart -->
    <div
      v-else-if="cartItems.length === 0 && !orderSuccess"
      class="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white"
    >
      <ShoppingCartIcon class="w-16 h-16 text-gray-200 mx-auto mb-4 stroke-[1.2]" />
      <h3 class="font-black text-gray-700">Your cart is empty</h3>
      <router-link to="/products" class="mt-4 inline-flex items-center gap-2 text-blue-600 text-sm hover:underline">
        Browse products
      </router-link>
    </div>

    <!-- Checkout Content -->
    <div v-else class="flex flex-col lg:flex-row gap-8 items-start">

      <!-- Left: Form -->
      <div class="flex-1 w-full space-y-6">

        <template v-if="orderSuccess || redirectingToPayway">

          <!-- Redirecting to ABA PayWay -->
          <div v-if="redirectingToPayway" class="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCodeIcon class="w-9 h-9 text-blue-500 animate-pulse" />
            </div>
            <h3 class="font-black text-blue-900 text-xl tracking-tight">Redirecting to ABA PayWay…</h3>
            <p class="text-blue-600 text-sm mt-2">Complete your payment in the window that opens. Don't close this page.</p>
          </div>

          <!-- Order Success -->
          <div v-else class="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon class="w-9 h-9 text-emerald-500" />
            </div>
            <h3 class="font-black text-emerald-900 text-xl tracking-tight">Order Placed Successfully!</h3>
            <p class="text-emerald-600 text-sm mt-2">Your order has been confirmed and is being processed.</p>
            <div class="flex gap-3 justify-center mt-6">
              <router-link
                to="/orders"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                View My Orders
              </router-link>
              <router-link
                to="/products"
                class="border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Continue Shopping
              </router-link>
            </div>
          </div>

        </template>

        <!-- Form Fields -->
        <template v-else>

          <!-- Error Alert -->
          <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
            <ExclamationCircleIcon class="w-4 h-4 flex-shrink-0 mt-0.5" />
            {{ errorMsg }}
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <MapPinIcon class="w-5 h-5 text-blue-600" />
              Shipping Address
            </h2>
            <textarea
              v-model="form.shipping_address"
              rows="3"
              placeholder="Enter your full shipping address..."
              class="w-full px-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 transition-colors resize-none"
              :class="errors.shipping_address
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'"
            />
            <p v-if="errors.shipping_address" class="text-red-500 text-xs mt-1.5">{{ errors.shipping_address }}</p>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <CreditCardIcon class="w-5 h-5 text-blue-600" />
              Payment Method
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="method in paymentMethods"
                :key="method.value"
                type="button"
                @click="form.payment_method = method.value"
                class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left"
                :class="form.payment_method === method.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'"
              >
                <component
                  :is="method.icon"
                  class="w-5 h-5 flex-shrink-0"
                  :class="form.payment_method === method.value ? 'text-blue-600' : 'text-gray-400'"
                />
                <span
                  class="font-semibold text-sm"
                  :class="form.payment_method === method.value ? 'text-blue-700' : 'text-gray-700'"
                >
                  {{ method.label }}
                </span>
              </button>
            </div>
            <p v-if="errors.payment_method" class="text-red-500 text-xs mt-2">{{ errors.payment_method }}</p>
          </div>

          <!-- Discount Code -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <TagIcon class="w-5 h-5 text-blue-600" />
              Discount Code
              <span class="text-xs font-medium text-gray-400">(optional)</span>
            </h2>

            <div v-if="appliedCoupon" class="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <div class="flex items-center gap-2">
                <CheckCircleIcon class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span class="text-sm font-bold text-emerald-700">{{ appliedCoupon }}</span>
                <span class="text-xs text-emerald-600">applied &middot; -${{ discountAmount.toFixed(2) }}</span>
              </div>
              <button
                type="button"
                @click="removeCoupon"
                class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                Remove
              </button>
            </div>

            <div v-else class="flex gap-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Enter code"
                @keyup.enter="applyCoupon"
                class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-100 transition-colors uppercase tracking-wide"
              />
              <button
                type="button"
                @click="applyCoupon"
                :disabled="applyingCoupon || !couponCode.trim()"
                class="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0"
                :class="applyingCoupon || !couponCode.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-blue-600 text-white'"
              >
                {{ applyingCoupon ? 'Checking...' : 'Apply' }}
              </button>
            </div>
            <p v-if="couponError" class="text-red-500 text-xs mt-2">{{ couponError }}</p>
          </div>

          <!-- Order Notes -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <PencilSquareIcon class="w-5 h-5 text-blue-600" />
              Order Notes
              <span class="text-xs font-medium text-gray-400">(optional)</span>
            </h2>
            <textarea
              v-model="form.order_notes"
              rows="2"
              placeholder="Special instructions, delivery notes..."
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-100 transition-colors resize-none"
            />
          </div>

          <!-- Place Order — mobile -->
          <button
            type="button"
            @click="placeOrder"
            :disabled="submitting"
            class="lg:hidden w-full py-3.5 rounded-xl font-black text-sm text-white uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            :class="submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'"
          >
            <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <LockClosedIcon v-else class="w-4 h-4 stroke-[2.5]" />
            {{ submitting ? 'Placing Order...' : `Place Order · $${grandTotal.toFixed(2)}` }}
          </button>

        </template>
      </div>

      <!-- Right: Order Summary -->
      <div class="w-full lg:w-80 flex-shrink-0">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">

          <h3 class="font-black text-gray-900 mb-5">Order Summary</h3>

          <!-- Items -->
          <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
            <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  v-if="item.product?.image"
                  :src="imageUrl(item.product.image)"
                  :alt="item.product?.name"
                  class="w-full h-full object-cover"
                  @error="e => e.target.style.opacity = '0'"
                >
                <CubeIcon v-else class="w-5 h-5 text-gray-300" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-gray-800 line-clamp-1">{{ item.product?.name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  <span v-if="item.variant">Size: {{ item.variant.size }} &middot; </span>× {{ item.quantity }}
                </p>
              </div>
              <p class="text-xs font-black text-gray-900 flex-shrink-0">
                ${{ (Number(item.product?.is_on_sale ? item.product.sale_price : item.product?.price ?? 0) * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t border-gray-100 mt-4 pt-4 space-y-2.5">
            <div class="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="discountAmount > 0" class="flex justify-between text-sm text-emerald-600 font-semibold">
              <span>Discount{{ appliedCoupon ? ` (${appliedCoupon})` : '' }}</span>
              <span>-${{ discountAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span :class="isFreeShipping ? 'text-green-600 font-semibold' : ''">
                {{ isFreeShipping ? 'Free' : '$5.00' }}
              </span>
            </div>
            <div v-if="taxRate > 0" class="flex justify-between text-sm text-gray-500">
              <span>Tax ({{ taxRate }}%)</span>
              <span>${{ taxAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-black text-gray-900 text-lg pt-3 border-t border-gray-100">
              <span>Total</span>
              <span class="text-blue-600">${{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Free shipping nudge -->
          <div
            v-if="subtotal > 0 && subtotal < 50"
            class="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700 text-center font-medium"
          >
            Add ${{ (50 - subtotal).toFixed(2) }} more for free shipping!
          </div>

          <!-- Place Order — desktop -->
          <button
            v-if="!orderSuccess"
            type="button"
            @click="placeOrder"
            :disabled="submitting"
            class="hidden lg:flex mt-5 w-full py-3.5 rounded-xl font-black text-sm text-white uppercase tracking-wider transition-all items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            :class="submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'"
          >
            <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <LockClosedIcon v-else class="w-4 h-4 stroke-[2.5]" />
            {{ submitting ? 'Placing Order...' : 'Place Order' }}
          </button>

        </div>
      </div>

    </div>
    <!-- Post-order Review Modal -->
    <PostOrderReviewModal
      :show="showReviewModal"
      :products="orderedProducts"
      @close="showReviewModal = false"
    />
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { imageUrl } from '@/api/axios'
import cartService from '@/services/cartService'
import orderService from '@/services/orderService'
import paymentService from '@/services/paymentService'
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  LockClosedIcon,
  CubeIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  PencilSquareIcon,
  TagIcon,
  QrCodeIcon,
} from '@heroicons/vue/24/outline'
import { useCartStore } from '@/stores/cart'
import PostOrderReviewModal from '@/components/checkout/PostOrderReviewModal.vue'

// ── Store ─────────────────────────────────────────────────────────────────────
const cartStore = useCartStore()
const router     = useRouter()

// ── State ─────────────────────────────────────────────────────────────────────
const cartItems       = ref([])
const loading         = ref(true)
const submitting      = ref(false)
const orderSuccess    = ref(false)
const errorMsg        = ref('')
const errors          = ref({})
const showReviewModal = ref(false)
const orderedProducts = ref([])
const taxRate         = ref(0)

// ── Discount / coupon state ─────────────────────────────────────────────────
const couponCode      = ref('')
const appliedCoupon   = ref(null)   // the validated code string, once applied
const discountAmount  = ref(0)
const couponError     = ref('')
const applyingCoupon  = ref(false)

const form = ref({
  shipping_address: '',
  payment_method:   'cash',
  order_notes:      '',
})

const paymentMethods = [
  { value: 'aba_payway', label: 'ABA PayWay (KHQR / Card)', icon: QrCodeIcon },
  { value: 'cash',   label: 'Cash on Delivery', icon: BanknotesIcon },
  { value: 'card',   label: 'Credit / Debit',   icon: CreditCardIcon },
  { value: 'mobile', label: 'Mobile Pay',        icon: DevicePhoneMobileIcon },
]

// ── Computed ──────────────────────────────────────────────────────────────────
const subtotal = computed(() =>
  cartItems.value.reduce((sum, i) => {
    const p = i.product
    const unitPrice = p?.is_on_sale ? Number(p.sale_price ?? 0) : Number(p?.price ?? 0)
    return sum + unitPrice * i.quantity
  }, 0)
)

const isFreeShipping = computed(() => subtotal.value >= 50)

const taxAmount = computed(() => (subtotal.value - discountAmount.value) * (taxRate.value / 100))

const grandTotal = computed(() =>
  subtotal.value - discountAmount.value + taxAmount.value + (isFreeShipping.value || subtotal.value === 0 ? 0 : 5)
)

// ── Methods ───────────────────────────────────────────────────────────────────
async function fetchCart(coupon = null) {
  loading.value = true
  try {
    const data = await cartService.getCart(coupon ? { coupon } : {})
    cartItems.value = data.items ?? []
    taxRate.value = Number(data.tax_rate ?? 0)

    if (coupon) {
      if (data.coupon_valid && data.coupon_code) {
        appliedCoupon.value  = data.coupon_code
        discountAmount.value = Number(data.discount_amount ?? 0)
        couponError.value    = ''
      } else {
        appliedCoupon.value  = null
        discountAmount.value = 0
        couponError.value    = data.coupon_message || 'Invalid discount code.'
      }
    }
  } catch (e) {
    console.error('Failed to load cart:', e)
  } finally {
    loading.value = false
  }
}

async function applyCoupon() {
  const code = couponCode.value.trim()
  if (!code) return
  applyingCoupon.value = true
  couponError.value = ''
  await fetchCart(code)
  applyingCoupon.value = false
}

function removeCoupon() {
  appliedCoupon.value  = null
  discountAmount.value = 0
  couponCode.value     = ''
  couponError.value    = ''
  fetchCart()
}

function validate() {
  errors.value = {}
  if (!form.value.shipping_address.trim()) {
    errors.value.shipping_address = 'Shipping address is required.'
  }
  if (!form.value.payment_method) {
    errors.value.payment_method = 'Please select a payment method.'
  }
  return Object.keys(errors.value).length === 0
}

async function placeOrder() {
  if (!validate()) return

  submitting.value = true
  errorMsg.value   = ''

  const productsForReview = cartItems.value.map(i => i.product).filter(Boolean)

  try {
    const { order } = await orderService.checkout({
      shipping_address: form.value.shipping_address,
      payment_method:   form.value.payment_method,
      order_notes:      form.value.order_notes || undefined,
      discount_code:    appliedCoupon.value || undefined,
    })

    cartItems.value = []
    cartStore.reset()

    if (form.value.payment_method === 'aba_payway') {
      // Order is placed (payment_status: pending) — now send the customer into
      // ABA's checkout widget to actually pay before we call this "done".
      await redirectToPayway(order.id)
      return
    }

    orderedProducts.value = productsForReview
    orderSuccess.value    = true

    // Show review modal shortly after success banner appears
    setTimeout(() => { showReviewModal.value = true }, 900)

  } catch (e) {
    errorMsg.value = e.response?.data?.message ?? 'Failed to place order. Please try again.'
  } finally {
    submitting.value = false
  }
}

// ── ABA PayWay redirect ──────────────────────────────────────────────────────
const redirectingToPayway = ref(false)
let paywayPollTimer = null

async function redirectToPayway(orderId) {
  redirectingToPayway.value = true

  try {
    const { endpoint, checkout_js, fields } = await paymentService.initPayway(orderId)

    await loadScriptOnce(checkout_js)

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = endpoint
    form.target = 'aba_webservice'
    form.style.display = 'none'

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input')
      input.type  = 'hidden'
      input.name  = name
      input.value = value ?? ''
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()

    // Safety net: if the customer closes ABA's popup without it redirecting them
    // back (continue_success_url), keep checking the real status ourselves.
    pollPaywayStatus(orderId)

  } catch (e) {
    redirectingToPayway.value = false
    submitting.value = false
    errorMsg.value = e.response?.data?.message ?? 'Could not start ABA PayWay checkout. Please try again.'
  }
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function pollPaywayStatus(orderId) {
  const startedAt = Date.now()
  const TWO_MINUTES = 2 * 60 * 1000

  paywayPollTimer = setInterval(async () => {
    if (Date.now() - startedAt > TWO_MINUTES) {
      clearInterval(paywayPollTimer)
      return
    }
    try {
      const { payment_status } = await paymentService.checkPaywayStatus(orderId)
      if (payment_status && payment_status !== 'pending') {
        clearInterval(paywayPollTimer)
        router.push({ name: 'order-detail', params: { id: orderId } })
      }
    } catch {
      // ignore transient errors, keep polling
    }
  }, 4000)
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(fetchCart)

onBeforeUnmount(() => {
  if (paywayPollTimer) clearInterval(paywayPollTimer)
})
</script>