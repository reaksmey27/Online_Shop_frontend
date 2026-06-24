<template>
  <section class="max-w-7xl mx-auto px-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
          Latest Arrivals
        </h2>
        <p class="text-sm text-gray-400">Fresh products curated just for you</p>
      </div>
      <router-link
        to="/products"
        class="text-blue-600 text-sm hover:text-blue-700 font-semibold flex items-center gap-1 group"
      >
        View All
        <ChevronRightIcon
          class="w-4 h-4 transition-transform group-hover:translate-x-0.5"
        />
      </router-link>
    </div>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="n in 8"
        :key="n"
        class="bg-white border border-gray-100 rounded-2xl h-80 animate-pulse"
      />
    </div>

    <div
      v-else-if="products.length > 0"
      class="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-red-100 transition-all group flex flex-col"
      >
        <!-- Image area (stable aspect ratio prevents layout shift on different images) -->
        <router-link
          :to="`/products/${product.id}`"
          class="relative block bg-gray-50 border-b border-gray-50"
        >
          <!-- HOT badge to match Deals UI -->
          <div
          <div class="aspect-[4/3] sm:aspect-[3/2] w-full">
            <div class="absolute inset-0 flex items-center justify-center p-4">
              <img
                v-if="getProductImage(product)"
                :src="imageUrl(getProductImage(product))"
                :alt="product.name"
                loading="lazy"
                class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                @error="(e) => (e.target.style.display = 'none')"
              />
              <CubeIcon v-else class="w-12 h-12 text-gray-300" />
            </div>
          </div>
        </router-link>

        <div class="p-5 flex-1 flex flex-col">
          <div class="min-h-[52px]">
            <p
              class="text-[10px] text-blue-600 font-bold tracking-wider uppercase mb-1"
            >
              {{ product.category?.name || "General" }}
            </p>
            <router-link
              :to="`/products/${product.id}`"
              class="font-semibold text-gray-800 text-sm hover:text-blue-600 line-clamp-2 min-h-[40px] block transition-colors duration-150"
            >
              {{ product.name }}
            </router-link>
          </div>

          <!-- Footer: wraps safely on small screens -->
          <div class="mt-auto pt-3 border-t border-gray-50">
            <div
              class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2"
            >
              <span class="text-gray-900 font-extrabold text-base">
                ${{ Number(product.price || 0).toFixed(2) }}
              </span>
              <button
                @click="addToCart(product)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/10 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShoppingCartIcon class="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-white rounded-2xl text-center text-gray-400 py-16 border border-dashed border-gray-100"
    >
      <CubeIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
      <p class="text-sm">No new products available right now.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import api, { imageUrl } from "@/api/axios"
import {
  ChevronRightIcon,
  CubeIcon,
  ShoppingCartIcon,
} from "@heroicons/vue/24/outline"

const auth = useAuthStore();
const router = useRouter();

const products = ref([]);
const loading = ref(true);

function getProductImage(product) {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.image_url ||
    product?.image_path ||
    null
  );
}

async function fetchProducts() {
  try {
    const res = await api.get("/products?per_page=8");
    products.value = res.data.data ?? res.data ?? [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function addToCart(product) {
  if (!auth.isLoggedIn) {
    router.push({ name: "login" });
    return;
  }
  try {
    await api.post("/cart", { product_id: product.id, quantity: 1 });
    // Emit a custom event for parent/global toast if needed; at minimum don't block with alert
    console.log(`"${product.name}" added to cart.`);
  } catch (e) {
    console.error(e.response?.data?.message || "Failed to add to cart");
  }
}

onMounted(fetchProducts);
</script>
