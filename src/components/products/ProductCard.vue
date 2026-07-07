<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex transition-all duration-200"
    :class="
      isListView
        ? 'flex-row items-center gap-6'
        : 'flex-col gap-4 justify-between'
    "
  >
    <div :class="isListView ? 'w-40 shrink-0' : 'w-full'">
      <div
        class="relative bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100/60"
        :class="isListView ? 'h-24 w-40' : 'aspect-[4/3] w-full'"
      >
        <span
          v-if="product.is_on_sale"
          class="absolute top-2 left-2 z-10 text-[10px] font-black text-white bg-red-500 rounded-full px-2 py-1 shadow-sm"
        >
          {{ product.discount_percent ? `-${product.discount_percent}%` : 'SALE' }}
        </span>
        <img
          v-if="productImage && !imgLoadError"
          :src="imageUrl(productImage)"
          :alt="product.name"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          @error="handleImageError"
        />
        <CubeIcon v-else class="w-8 h-8 text-gray-300 stroke-[1.2]" />
      </div>
    </div>

    <div class="flex-1 min-w-0 flex flex-col justify-between h-full">
      <div>
        <router-link
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="block group"
        >
          <h3
            class="font-black text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
          >
            {{ product.name }}
          </h3>
        </router-link>
        <p
          v-if="categoryName"
          class="text-[10px] font-black text-gray-400 mt-1.5 uppercase tracking-wider"
        >
          {{ categoryName }}
        </p>
      </div>

      <div class="mt-2.5 flex items-baseline gap-2 flex-wrap">
        <span class="font-black text-gray-900 text-base tracking-tight">
          ${{ Number(displayPrice).toFixed(2) }}
        </span>
        <span
          v-if="product.is_on_sale"
          class="text-xs text-gray-400 line-through font-medium"
        >
          ${{ Number(product.price).toFixed(2) }}
        </span>
        <span v-if="avgRating" class="ml-auto text-xs font-semibold text-amber-500 flex items-center gap-0.5">
          ★ {{ avgRating }}
        </span>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button
          type="button"
          @click="$emit('add-to-cart', product)"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm shadow-blue-600/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          Add to cart
        </button>

        <router-link
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="text-xs font-bold text-blue-700 hover:text-blue-800 px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50/50 transition-colors text-center whitespace-nowrap"
        >
          View
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { imageUrl } from "@/api/axios";
import { CubeIcon } from "@heroicons/vue/24/outline";

defineEmits(["add-to-cart"]);

const props = defineProps({
  product: { type: Object, required: true },
  viewMode: { type: String, default: "grid" },
});

const imgLoadError = ref(false);

const isListView = computed(() => props.viewMode === "list");

const categoryName = computed(
  () => props.product?.category?.name || props.product?.category_name || null,
);

const productImage = computed(() => {
  const p = props.product;
  return p?.image || p?.imageUrl || p?.image_url || p?.image_path || null;
});

const avgRating = computed(() => {
  const r = props.product?.average_rating ?? props.product?.reviews_avg_rating
  return r ? Number(r).toFixed(1) : null
})

const displayPrice = computed(() =>
  props.product?.is_on_sale ? props.product.sale_price : (props.product?.price || 0)
)

function handleImageError() {
  imgLoadError.value = true;
}

watch(
  () => productImage.value,
  () => {
    imgLoadError.value = false;
  },
);
</script>
