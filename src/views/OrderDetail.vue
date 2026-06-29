<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 antialiased">

    <div class="mb-6">
      <router-link to="/orders" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ChevronLeftIcon class="w-4 h-4" />
        Back to Orders
      </router-link>
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="bg-gray-100 h-20 rounded-2xl" />
      <div class="bg-gray-100 h-64 rounded-2xl" />
    </div>

    <div v-else-if="!order" class="text-center py-20">
      <ExclamationCircleIcon class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h3 class="font-bold text-gray-700">Order not found</h3>
      <router-link to="/orders" class="mt-4 inline-block text-blue-600 text-sm hover:underline">
        Back to Orders
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <OrderHeader
          :order-id="order.id"
          :created-at="order.created_at"
          :status="order.status"
          :payment-status="order.payment_status"
        />

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Review button — for delivered orders -->
          <button
            v-if="order.status === 'delivered'"
            @click="openReviewModal"
            class="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700
                   border border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100
                   px-4 py-2 rounded-xl transition-all"
          >
            <StarIcon class="w-4 h-4" />
            Review Products
          </button>

          <!-- Cancel button — only for pending orders -->
          <button
            v-if="order.status === 'pending'"
            @click="confirmCancel"
            :disabled="cancelling"
            class="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700
                   border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircleIcon class="w-4 h-4" />
            {{ cancelling ? 'Cancelling…' : 'Cancel Order' }}
          </button>
        </div>
      </div>

      <!-- Cancel confirm dialog -->
      <div
        v-if="showCancelConfirm"
        class="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <p class="text-sm text-red-700 font-medium">
          Are you sure you want to cancel this order? This cannot be undone.
        </p>
        <div class="flex gap-2 shrink-0">
          <button
            @click="cancelOrder"
            class="text-xs font-bold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Cancel
          </button>
          <button
            @click="showCancelConfirm = false"
            class="text-xs font-bold border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Keep Order
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 space-y-4">
          <OrderItemsList :items="order.items" :total-amount="order.total_amount" />
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
  </div>

  <ToastNotification ref="toast" />

  <!-- Post-order Review Modal -->
  <PostOrderReviewModal
    :show="showReviewModal"
    :products="orderProducts"
    @close="showReviewModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import { ChevronLeftIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'
import OrderHeader      from '@/components/orders/OrderHeader.vue'
import OrderItemsList   from '@/components/orders/OrderItemsList.vue'
import OrderSidebarInfo from '@/components/orders/OrderSidebarInfo.vue'
import ToastNotification from '@/components/common/Toastnotification.vue'
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
    const res = await api.get(`/orders/${route.params.id}`)
    order.value = res.data
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
    const res   = await api.delete(`/orders/${order.value.id}/cancel`)
    order.value = res.data.order
    toast.value?.show('Order cancelled successfully.', 'success')
  } catch (e) {
    toast.value?.show(e.response?.data?.message || 'Failed to cancel order.', 'error')
  } finally {
    cancelling.value = false
  }
}

onMounted(fetchOrder)
</script>
