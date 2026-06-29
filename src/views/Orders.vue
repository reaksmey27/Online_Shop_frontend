<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Track and manage your purchases</p>
      </div>

      <!-- Filters -->
      <div class="mb-5 flex flex-wrap gap-2">
        <button
          v-for="f in STATUS_FILTERS"
          :key="f.value"
          @click="setStatus(f.value)"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
          :class="activeStatus === f.value
            ? 'bg-gray-900 text-white'
            : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'"
        >
          {{ f.label }}
          <span v-if="statusCount(f.value) > 0 && f.value !== 'all'" class="ml-1 opacity-60">
            {{ statusCount(f.value) }}
          </span>
        </button>

        <div class="ml-auto flex items-center gap-2">
          <button
            v-for="p in PAYMENT_FILTERS"
            :key="p.value"
            @click="setPayment(p.value)"
            class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            :class="activePayment === p.value
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'"
          >
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 4" :key="n" class="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
      </div>

      <OrdersEmptyState v-else-if="orders.length === 0" />

      <div v-else-if="filteredOrders.length === 0" class="text-center py-16 bg-white border border-gray-100 rounded-2xl">
        <p class="text-sm font-medium text-gray-500">No orders match this filter.</p>
        <button @click="resetFilters" class="mt-2 text-xs text-blue-600 hover:underline">Clear filters</button>
      </div>

      <template v-else>
        <div class="space-y-3">
          <OrderCard v-for="order in paginatedOrders" :key="order.id" :order="order" />
        </div>

        <OrderPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :visible-pages="visiblePages"
          @go="goTo"
        />
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import orderService from '@/services/orderService'
import OrderCard from '@/components/orders/OrderCard.vue'
import OrdersEmptyState from '@/components/orders/OrdersEmptyState.vue'
import OrderPagination from '@/components/orders/OrderPagination.vue'

const PER_PAGE = 10

const orders  = ref([])
const loading = ref(true)

const STATUS_FILTERS = [
  { value: 'all',        label: 'All' },
  { value: 'pending',    label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped' },
  { value: 'delivered',  label: 'Delivered' },
  { value: 'completed',  label: 'Completed' },
  { value: 'cancelled',  label: 'Cancelled' },
]

const PAYMENT_FILTERS = [
  { value: 'all',    label: 'All payments' },
  { value: 'paid',   label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
]

const activeStatus  = ref('all')
const activePayment = ref('all')
const currentPage   = ref(1)

const filteredOrders = computed(() =>
  orders.value.filter(o => {
    const statusMatch  = activeStatus.value  === 'all' || o.status         === activeStatus.value
    const paymentMatch = activePayment.value === 'all' || o.payment_status === activePayment.value
    return statusMatch && paymentMatch
  })
)

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / PER_PAGE))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return filteredOrders.value.slice(start, start + PER_PAGE)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)

  return pages
})

function goTo(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

watch([activeStatus, activePayment], () => { currentPage.value = 1 })

function setStatus(val)  { activeStatus.value  = val }
function setPayment(val) { activePayment.value = val }

function statusCount(status) {
  return orders.value.filter(o => o.status === status).length
}

function resetFilters() {
  activeStatus.value  = 'all'
  activePayment.value = 'all'
}

async function fetchOrders() {
  loading.value = true
  try {
    const data = await orderService.getOrders()
    orders.value = data ?? []
  } catch (e) {
    console.error('Error fetching orders:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)
</script>