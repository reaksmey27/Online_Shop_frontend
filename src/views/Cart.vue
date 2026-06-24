<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    <div class="mb-10">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">My Cart</h1>
      <p class="text-sm text-gray-400 mt-1">Review your items before checkout</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col lg:flex-row gap-6 animate-pulse">
      <div class="flex-1 space-y-4">
        <div v-for="n in 3" :key="n" class="bg-gray-100 rounded-2xl h-24" />
      </div>
      <div class="w-full lg:w-80 bg-gray-100 rounded-2xl h-64 shrink-0" />
    </div>

    <!-- Empty -->
    <div v-else-if="items.length === 0"
         class="text-center py-20 border border-dashed border-gray-200 rounded-3xl
                bg-gray-50/30 max-w-xl mx-auto">
      <ShoppingCartIcon class="w-16 h-16 text-gray-300 mx-auto mb-4 stroke-[1.2]" />
      <h3 class="text-lg font-black text-gray-800 tracking-tight">Your cart is empty</h3>
      <p class="text-sm text-gray-400 mt-1">Add some products to get started</p>
      <router-link to="/products"
        class="mt-8 inline-flex items-center gap-2 bg-gray-900 hover:bg-blue-600 text-white
               px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider
               transition-all duration-200 shadow-sm">
        <ShoppingBagIcon class="w-4 h-4 stroke-[2]" />
        Browse Products
      </router-link>
    </div>

    <!-- Cart Content -->
    <div v-else class="flex flex-col lg:flex-row gap-6 items-start">

      <!-- Items Column -->
      <div class="flex-1 w-full space-y-4">

        <!-- Select All Bar -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5
                    flex items-center justify-between">
          <label class="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
              class="w-4 h-4 accent-blue-600 cursor-pointer"
            >
            <span class="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Select All ({{ items.length }} items)
            </span>
          </label>
          <button
            v-if="selectedIds.length > 0"
            @click="removeSelected"
            class="text-xs font-bold text-red-500 hover:text-red-600 flex items-center
                   gap-1.5 uppercase tracking-wider transition-colors focus:outline-none">
            <TrashIcon class="w-4 h-4 stroke-[2]" />
            Remove Selected
          </button>
        </div>

        <!-- Cart Item Rows -->
        <div class="space-y-3">
          <CartItemRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :is-selected="selectedIds.includes(item.id)"
            @toggle-select="toggleSelectItem"
            @update-qty="updateQty"
            @remove="removeItem"
          />
        </div>
      </div>

      <!-- Summary Column -->
      <CartSummary
        :selected-items="selectedItems"
        :total-amount="selectedTotal"
        @checkout="goCheckout"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { ShoppingCartIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/vue/24/outline'

import CartItemRow from '@/components/cart/CartItemRow.vue'
import CartSummary from '@/components/cart/CartSummary.vue'

const router = useRouter()
const items  = ref([])
const loading = ref(true)
const selectedIds = ref([])

const allSelected = computed(() =>
    items.value.length > 0 && selectedIds.value.length === items.value.length
)

const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.includes(item.id))
)

const selectedTotal = computed(() =>
    selectedItems.value.reduce(
        (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
        0
    )
)

async function fetchCart() {
    loading.value = true
    try {
        const res        = await api.get('/cart')
        items.value      = res.data.items ?? []
        // Auto-select all items on load
        selectedIds.value = items.value.map(i => i.id)
    } catch (e) {
        console.error('Failed to load cart:', e)
    } finally {
        loading.value = false
    }
}

async function updateQty(item, newQty) {
    if (newQty < 1) return
    try {
        await api.put(`/cart/${item.id}`, { quantity: newQty })
        item.quantity = newQty
    } catch (e) {
        alert(e.response?.data?.message ?? 'Failed to update quantity.')
    }
}

async function removeItem(id) {
    try {
        await api.delete(`/cart/${id}`)
        items.value       = items.value.filter(i => i.id !== id)
        selectedIds.value = selectedIds.value.filter(i => i !== id)
    } catch (e) {
        alert('Failed to remove item.')
    }
}

async function removeSelected() {
    const ids = [...selectedIds.value]
    try {
        await Promise.all(ids.map(id => api.delete(`/cart/${id}`)))
        items.value       = items.value.filter(i => !ids.includes(i.id))
        selectedIds.value = []
    } catch (e) {
        alert('Failed to remove selected items.')
    }
}

function toggleSelectItem(id) {
    const idx = selectedIds.value.indexOf(id)
    if (idx === -1) {
        selectedIds.value.push(id)
    } else {
        selectedIds.value.splice(idx, 1)
    }
}

function toggleSelectAll() {
    selectedIds.value = allSelected.value
        ? []
        : items.value.map(i => i.id)
}

function goCheckout() {
    if (selectedIds.value.length > 0) {
        router.push({ name: 'checkout' })
    }
}

onMounted(fetchCart)
</script>
