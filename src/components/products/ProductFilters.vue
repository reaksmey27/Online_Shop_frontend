<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 sticky top-24">
    <div>
      <h3 class="font-black text-gray-900 tracking-tight">Filters</h3>
      <p class="text-xs text-gray-500 mt-1">Refine your search</p>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Search</label>
      <input
        v-model="filters.search"
        @input="$emit('change', 'search')"
        type="text"
        placeholder="Search products..."
        class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors text-gray-800 placeholder-gray-400"
      />
    </div>

    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Category</label>
      <select
        v-model="filters.category_id"
        @change="$emit('change', 'category_id')"
        class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors bg-white text-gray-800"
      >
        <option :value="null">All categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="Number(cat.id)">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-700 block">Sort By</label>
      <select
        v-model="filters.sort"
        @change="$emit('change', 'sort')"
        class="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 transition-colors bg-white text-gray-800"
      >
        <option value="created_at">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="name">Name: A → Z</option>
      </select>
    </div>

    <div class="pt-2">
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
defineProps({
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(["change", "reset"])

const filters = defineModel({
  type: Object,
  default: () => ({ search: "", category_id: null, sort: "created_at" })
})

function handleReset() {
  filters.value = {
    search: "",
    category_id: null,
    sort: "created_at",
  }
  emit("reset")
}
</script>