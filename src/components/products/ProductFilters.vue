<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-24">
    <div>
      <h3 class="font-black text-gray-900 tracking-tight">Filters</h3>
      <p class="text-xs text-gray-500 mt-1">Refine your search</p>
    </div>

    <!-- Search -->
    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Search</label>
      <input
        v-model="filters.search"
        @input="emit('search')"
        type="text"
        placeholder="Search products..."
        class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors text-gray-800 placeholder-gray-400"
      />
    </div>

    <!-- Category -->
    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Category</label>
      <select
        v-model="filters.category_id"
        @change="emit('sort-change')"
        class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors bg-white text-gray-800"
      >
        <option :value="null">All categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="Number(cat.id)">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Price Range</label>
      <div class="flex items-center gap-2">
        <input
          v-model.number="filters.price_min"
          @change="emit('sort-change')"
          type="number"
          min="0"
          placeholder="Min"
          class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors text-gray-800"
        />
        <span class="text-gray-400 text-xs font-bold shrink-0">to</span>
        <input
          v-model.number="filters.price_max"
          @change="emit('sort-change')"
          type="number"
          min="0"
          placeholder="Max"
          class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors text-gray-800"
        />
      </div>
    </div>

    <!-- In Stock Only -->
    <div class="flex items-center gap-2">
      <input
        id="in_stock"
        v-model="filters.in_stock"
        @change="emit('sort-change')"
        type="checkbox"
        class="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      <label for="in_stock" class="text-xs font-bold text-gray-700 cursor-pointer select-none">
        In Stock Only
      </label>
    </div>

    <!-- Sort -->
    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Sort By</label>
      <select
        v-model="filters.sort"
        @change="emit('sort-change')"
        class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors bg-white text-gray-800"
      >
        <option value="created_at">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="name">Name: A → Z</option>
      </select>
    </div>

    <!-- Active filter count badge -->
    <div v-if="activeFilterCount > 0" class="text-xs text-blue-600 font-semibold">
      {{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }} active
    </div>

    <div class="pt-1">
      <button
        type="button"
        @click="handleReset"
        class="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 px-4 py-2.5 rounded-xl active:scale-[0.99] transition-all cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(['search', 'sort-change', 'reset'])

const filters = defineModel({
  type: Object,
  default: () => ({
    search: '', category_id: null, sort: 'created_at',
    price_min: null, price_max: null, in_stock: false,
  }),
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.search)      count++
  if (filters.value.category_id) count++
  if (filters.value.price_min)   count++
  if (filters.value.price_max)   count++
  if (filters.value.in_stock)    count++
  return count
})

function handleReset() {
  filters.value = {
    search: '', category_id: null, sort: 'created_at',
    price_min: null, price_max: null, in_stock: false,
  }
  emit('reset')
}
</script>