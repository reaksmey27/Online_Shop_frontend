<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-gray-900">
        All Products
      </h1>
      <p class="text-gray-500 mt-1">Browse our full collection</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar Filter -->
      <aside class="w-full lg:w-60 flex-shrink-0">
        <div class="lg:hidden mb-4">
          <ProductFilter
            v-model="filters"
            :categories="categories"
            @reset="resetFilters"
            @search="debouncedFetch"
            @sort-change="fetchProducts"
          />
        </div>
        <div class="hidden lg:block">
          <ProductFilter
            v-model="filters"
            :categories="categories"
            @reset="resetFilters"
            @search="debouncedFetch"
            @sort-change="fetchProducts"
          />
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Toolbar -->
        <div class="flex items-center justify-between mb-5">
          <p class="text-sm text-gray-400">
            <template v-if="!loading">
              <span class="font-semibold text-gray-700">{{ total }}</span>
              products found
            </template>
            <template v-else>Searching...</template>
          </p>
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded-md transition-colors"
              :class="
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-gray-700'
                  : 'text-gray-400'
              "
            >
              <Squares2X2Icon class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded-md transition-colors"
              :class="
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-700'
                  : 'text-gray-400'
              "
            >
              <ListBulletIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div
          v-if="loading"
          :class="
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 gap-4'
              : 'flex flex-col gap-3'
          "
        >
          <div
            v-for="n in 9"
            :key="n"
            class="bg-gray-100 rounded-2xl animate-pulse"
            :class="viewMode === 'grid' ? 'h-64' : 'h-24'"
          />
        </div>

        <!-- Grid View -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list'" class="flex flex-col gap-3">
          <ProductListRow
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && products.length === 0"
          class="text-center py-20 border border-dashed border-gray-200 rounded-2xl"
        >
          <CubeIcon class="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p class="font-semibold text-gray-500">No products found</p>
          <p class="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters
          </p>
          <button
            @click="resetFilters"
            class="mt-4 text-blue-600 text-sm hover:underline"
          >
            Reset Filters
          </button>
        </div>

        <!-- Pagination -->
        <AppPagination
          v-model:currentPage="currentPage"
          :last-page="lastPage"
          class="mt-8"
          @change="changePage"
        />
      </div>
    </div>
    <ToastNotification ref="toast" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import ToastNotification from "@/components/common/ToastNotification.vue";
import api from "@/api/axios";
import {
  CubeIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";

import ProductCard from "@/components/products/ProductCard.vue";
import ProductListRow from "@/components/products/ProductListRow.vue";
import ProductFilter from "@/components/products/ProductFilters.vue";
import AppPagination from "@/components/products/ProductPagination.vue";

const toast = ref(null);
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const total = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);
const viewMode = ref("grid");

const filters = ref({
  search: route.query.search ?? "",
  category_id: route.query.category_id ? Number(route.query.category_id) : null,
  sort: route.query.sort ?? "created_at",
  order: route.query.order ?? "desc",
});

function getSortParams() {
  const map = {
    price_asc: { sort: "price", order: "asc" },
    price_desc: { sort: "price", order: "desc" },
    name: { sort: "name", order: "asc" },
    created_at: { sort: "created_at", order: "desc" },
  };
  return map[filters.value.sort] ?? { sort: "created_at", order: "desc" };
}

async function fetchProducts() {
  loading.value = true;
  try {
    const { sort, order } = getSortParams();
    const params = {
      page: currentPage.value,
      per_page: 12,
      sort,
      order,
    };
    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.category_id)
      params.category_id = filters.value.category_id;

    router.replace({
      query: {
        ...(filters.value.search ? { search: filters.value.search } : {}),
        ...(filters.value.category_id
          ? { category_id: filters.value.category_id }
          : {}),
        ...(filters.value.sort !== "created_at"
          ? { sort: filters.value.sort }
          : {}),
        ...(currentPage.value > 1 ? { page: currentPage.value } : {}),
      },
    });

    const res = await api.get("/products", { params });
    products.value = res.data.data;
    total.value = res.data.total;
    currentPage.value = res.data.current_page;
    lastPage.value = res.data.last_page;
  } catch (e) {
    console.error("Failed to fetch products:", e);
  } finally {
    loading.value = false;
  }
}

async function fetchCategories() {
  try {
    const res = await api.get("/categories");
    categories.value = res.data;
  } catch (e) {
    console.error("Failed to fetch categories:", e);
  }
}

function changePage(page) {
  if (page < 1 || page > lastPage.value) return;
  currentPage.value = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetFilters() {
  filters.value = {
    search: "",
    category_id: null,
    sort: "created_at",
    order: "desc",
  };
  currentPage.value = 1;
  fetchProducts();
}

// Debounced search
let debounceTimer = null;
function debouncedFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchProducts();
  }, 400);
}

async function addToCart(product) {
  if (!auth.isLoggedIn) {
    router.push({ name: "login" });
    return;
  }
  try {
    await api.post("/cart", { product_id: product.id, quantity: 1 });
    toast.value.show(`"${product.name}" added to cart!`);
  } catch (e) {
    toast.value.show(
      e.response?.data?.message ?? "Failed to add to cart.",
      "error",
    );
  }
}

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>
