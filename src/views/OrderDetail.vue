<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      <div class="mb-6">
        <router-link
          to="/orders"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          Back to Orders
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="bg-white rounded-2xl h-24 border border-gray-100" />
        <div class="bg-white rounded-2xl h-72 border border-gray-100" />
      </div>

      <!-- Not found -->
      <div v-else-if="!order" class="text-center py-24 bg-white rounded-2xl border border-gray-100">
        <ExclamationCircleIcon class="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <h3 class="font-semibold text-gray-700">Order not found</h3>
        <router-link to="/orders" class="mt-3 inline-block text-sm text-blue-600 hover:underline">
          Go back to Orders
        </router-link>
      </div>

      <div v-else class="space-y-5">

        <!-- Header row -->
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <OrderHeader
            :order-id="order.id"
            :created-at="order.created_at"
            :status="order.status"
            :payment-status="order.payment_status"
          />

          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-if="order.status === 'delivered'"
              @click="openReviewModal"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700
                     border border-amber-200 hover:border-amber-300 bg-amber-50 hover:bg-amber-100
                     px-4 py-2 rounded-xl transition-all"
            >
              <StarIcon class="w-4 h-4" />
              Leave a Review
            </button>

            <button
              v-if="order.status === 'pending'"
              @click="confirmCancel"
              :disabled="cancelling"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600
                     border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100
                     px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircleIcon class="w-4 h-4" />
              {{ cancelling ? 'Cancelling…' : 'Cancel Order' }}
            </button>
          </div>
        </div>

        <!-- Cancel confirm -->
        <div
          v-if="showCancelConfirm"
          class="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p class="text-sm text-red-700 font-medium">
            Cancel this order? This can't be undone.
          </p>
          <div class="flex gap-2 shrink-0">
            <button
              @click="cancelOrder"
              class="text-xs font-semibold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Cancel
            </button>
            <button
              @click="showCancelConfirm = false"
              class="text-xs font-semibold border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              Keep Order
            </button>
          </div>
        </div>

        <!-- Main content -->
        <div class="flex flex-col lg:flex-row gap-5">
          <div class="flex-1 min-w-0">
            <OrderItemsList
              :items="order.items"
              :total-amount="order.total_amount"
              :subtotal="order.subtotal"
              :tax-rate="order.tax_rate"
              :tax-amount="order.tax_amount"
              :discount-code="order.discount_code"
              :discount-amount="order.discount_amount"
            />
          </div>
          <OrderSidebarInfo
            :address="order.shipping_address"
            :payment-method="order.payment_method"
            :payment-status="order.payment_status"
            :current-status="order.status"
            :order-notes="order.order_notes"
          />
        </div>

      </div>

      <PostOrderReviewModal
        :show="showReviewModal"
        :products="orderProducts"
        @close="showReviewModal = false"
      />
      <ToastNotification ref="toast" />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import orderService from '@/services/orderService'
import { ChevronLeftIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'
import OrderHeader        from '@/components/orders/OrderHeader.vue'
import OrderItemsList     from '@/components/orders/OrderItemsList.vue'
import OrderSidebarInfo   from '@/components/orders/OrderSidebarInfo.vue'
import ToastNotification  from '@/components/common/Toastnotification.vue'
import PostOrderReviewModal from '@/components/checkout/PostOrderReviewModal.vue'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const toast   = ref(null)
const cancelling        = ref(false)
const showCancelConfirm = ref(false)
const showReviewModal   = ref(false)

const orderProducts = computed(() =>
  (order.value?.items ?? []).map(i => i.product).filter(Boolean)
)

function openReviewModal() {
  showReviewModal.value = true
}

async function fetchOrder() {
  loading.value = true
  try {
    const data = await orderService.getOrder(route.params.id)
    order.value = data
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

function confirmCancel() {
  showCancelConfirm.value = true
}

async function cancelOrder() {
  cancelling.value        = true
  showCancelConfirm.value = false
  try {
    const data = await orderService.cancelOrder(order.value.id)
    order.value = data.order ?? order.value
    toast.value?.show('Order cancelled successfully.', 'success')
  } catch (e) {
    toast.value?.show(e.response?.data?.message || 'Failed to cancel order.', 'error')
  } finally {
    cancelling.value = false
  }
}

onMounted(fetchOrder)
</script>
