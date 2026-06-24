<template>
  <header class="bg-white sticky top-0 z-50 shadow-sm">
    <!-- Top Bar -->
    <div class="border-b border-gray-100">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      >
        <!-- Logo -->
        <router-link
          to="/"
          class="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <ShoppingCartIcon class="w-5 h-5 text-blue-600" />
          <span
            >Online<span class="text-blue-600 font-semibold">Shop</span></span
          >
        </router-link>

        <!-- Search Bar (desktop) -->
        <form
          @submit.prevent="doSearch"
          class="hidden md:flex flex-1 max-w-xl items-center relative"
        >
          <div class="relative w-full">
            <MagnifyingGlassIcon
              class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-400"
              @keydown.esc="searchQuery = ''"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          <button
            type="submit"
            class="ml-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
          >
            Search
          </button>
        </form>

        <!-- Right Icons -->
        <div class="flex items-center gap-1">
          <!-- Mobile Search Toggle -->
          <button
            @click="mobileSearchOpen = !mobileSearchOpen"
            class="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>

          <!-- Logged In -->
          <template v-if="auth.isLoggedIn">
            <router-link
              to="/wishlist"
              class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors group"
              title="Wishlist"
            >
              <HeartIcon
                class="w-5 h-5 group-hover:scale-105 transition-transform"
              />
            </router-link>
            <router-link
              to="/cart"
              class="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors group"
              title="Cart"
            >
              <ShoppingCartIcon
                class="w-5 h-5 group-hover:scale-105 transition-transform"
              />
            </router-link>

            <!-- User Dropdown -->
            <div class="relative ml-1" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <div
                  class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs select-none"
                >
                  {{ userInitials }}
                </div>
                <span class="hidden lg:block">{{ auth.user?.name }}</span>
                <ChevronDownIcon
                  class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': dropdownOpen }"
                />
              </button>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                leave-active-class="transition duration-75 ease-in"
                leave-to-class="transform scale-95 opacity-0 -translate-y-1"
              >
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 border border-gray-100 z-50 divide-y divide-gray-50 origin-top-right"
                >
                  <div class="py-1">
                    <router-link
                      to="/orders"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      @click="dropdownOpen = false"
                    >
                      <ClipboardDocumentListIcon
                        class="w-4 h-4 text-gray-400"
                      />
                      My Orders
                    </router-link>
                    <router-link
                      to="/profile"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      @click="dropdownOpen = false"
                    >
                      <UserIcon class="w-4 h-4 text-gray-400" />
                      Profile
                    </router-link>
                  </div>
                  <div class="py-1">
                    <button
                      @click="handleLogout"
                      class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                    >
                      <ArrowRightOnRectangleIcon class="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </template>

          <!-- Guest -->
          <template v-else>
            <router-link
              to="/login"
              class="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="text-sm font-bold bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Register
            </router-link>
          </template>

          <!-- Mobile Hamburger -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors ml-1"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5" />
            <XMarkIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Nav Bar (desktop) — Home, Categories, Deals, New Arrivals -->
    <div class="hidden md:block border-b border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-0">
          <!-- Home Link -->
          <router-link
            to="/"
            class="flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
            active-class="text-blue-600 bg-blue-50 font-semibold"
            exact-active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            <HomeIcon class="w-4 h-4" /> Home
          </router-link>

          <!-- Divider -->
          <div class="w-px h-10 bg-gray-100 mx-2" />

          <!-- All Categories Mega Menu Trigger -->
          <div class="relative" ref="categoryMenuRef">
            <button
              @click="categoryMenuOpen = !categoryMenuOpen"
              class="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              :class="categoryMenuOpen ? 'bg-blue-700' : ''"
            >
              <Bars3Icon class="w-4 h-4" />
              All Categories
              <ChevronDownIcon
                class="w-3.5 h-3.5 transition-transform duration-200"
                :class="{ 'rotate-180': categoryMenuOpen }"
              />
            </button>

            <!-- Mega Dropdown -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div
                v-if="categoryMenuOpen"
                class="absolute left-0 top-full mt-0 w-64 bg-white rounded-b-2xl shadow-2xl border border-gray-100 z-50 py-2 max-h-[70vh] overflow-y-auto"
              >
                <!-- Loading -->
                <div v-if="loadingCategories" class="px-4 py-8 text-center">
                  <div
                    class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"
                  />
                </div>

                <!-- Category List -->
                <template v-else>
                  <router-link
                    to="/categories"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                    @click="categoryMenuOpen = false"
                  >
                    <Squares2X2Icon class="w-4 h-4" />
                    View All Categories
                  </router-link>
                  <div class="border-t border-gray-100 my-1" />
                  <router-link
                    v-for="cat in categories"
                    :key="cat.id"
                    :to="`/products?category_id=${cat.id}`"
                    class="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors group"
                    @click="categoryMenuOpen = false"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0"
                      >
                        <img
                          v-if="cat.image"
                          :src="imageUrl(cat.image)"
                          :alt="cat.name"
                          class="w-full h-full object-cover"
                          @error="(e) => (e.target.style.display = 'none')"
                        />
                        <TagIcon v-else class="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <span class="font-medium">{{ cat.name }}</span>
                    </div>
                    <span
                      class="text-xs text-gray-400 group-hover:text-blue-400"
                    >
                      {{ cat.products_count }}
                    </span>
                  </router-link>
                </template>
              </div>
            </transition>
          </div>

          <!-- Nav Links -->
          <nav class="flex items-center">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all relative"
            active-class="text-blue-800 bg-blue-50 font-semibold"
            exact-active-class="text-blue-800 bg-blue-50 font-semibold"
            :class="link.badge ? 'pr-3' : ''"
          >
              <component :is="link.icon" class="w-4 h-4" />
              {{ link.label }}
              <!-- Badge for Deals -->
              <span
                v-if="link.badge"
                class="absolute top-2 right-1 text-[9px] font-black bg-red-500 text-white px-1 rounded leading-tight"
              >
                {{ link.badge }}
              </span>
            </router-link>
          </nav>
        </div>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileSearchOpen"
        class="md:hidden px-4 py-3 border-b border-gray-100 bg-white"
      >
        <form @submit.prevent="doSearch" class="flex gap-2">
          <div class="relative flex-1">
            <MagnifyingGlassIcon
              class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              v-model="searchQuery"
              ref="mobileSearchInput"
              type="text"
              placeholder="Search products..."
              class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              autofocus
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go
          </button>
        </form>
      </div>
    </transition>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-b border-gray-100 bg-white px-4 py-3 space-y-1"
      >
        <!-- Main links -->
        <router-link
          to="/"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          exact-active-class="bg-blue-50 text-blue-600 font-semibold"
        >
          <HomeIcon class="w-4 h-4" /> Home
        </router-link>

        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          active-class="bg-blue-50 text-blue-600 font-semibold"
        >
          <component :is="link.icon" class="w-4 h-4" />
          {{ link.label }}
          <span
            v-if="link.badge"
            class="ml-auto text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded"
          >
            {{ link.badge }}
          </span>
        </router-link>

        <!-- Divider -->
        <div class="border-t border-gray-100 my-2" />

        <!-- Auth links -->
        <template v-if="auth.isLoggedIn">
          <router-link
            to="/wishlist"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <HeartIcon class="w-4 h-4" /> Wishlist
          </router-link>
          <router-link
            to="/cart"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ShoppingCartIcon class="w-4 h-4" /> Cart
          </router-link>
          <router-link
            to="/orders"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ClipboardDocumentListIcon class="w-4 h-4" /> My Orders
          </router-link>
          <router-link
            to="/profile"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <UserIcon class="w-4 h-4" /> Profile
          </router-link>
          <button
            @click="handleLogout"
            class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" /> Logout
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <UserCircleIcon class="w-4 h-4" /> Login
          </router-link>
          <router-link
            to="/register"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <UserPlusIcon class="w-4 h-4" /> Register
          </router-link>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api, { imageUrl } from "@/api/axios";
import {
  ShoppingCartIcon,
  HeartIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  UserCircleIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  TagIcon,
  SparklesIcon,
  BoltIcon,
  Squares2X2Icon,
} from "@heroicons/vue/24/outline";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// ── State ─────────────────────────────────────────────────
const searchQuery = ref("");
const mobileSearchOpen = ref(false);
const mobileMenuOpen = ref(false);
const dropdownOpen = ref(false);
const categoryMenuOpen = ref(false);
const categories = ref([]);
const loadingCategories = ref(false);

const dropdownRef = ref(null);
const categoryMenuRef = ref(null);

// ── Nav Links ─────────────────────────────────────────────
const navLinks = [
  { to: "/products", label: "Products", icon: TagIcon },
  { to: "/categories", label: "Categories", icon: Squares2X2Icon },
  { to: "/deals", label: "Deals", icon: BoltIcon, badge: "HOT" },
  { to: "/new-arrivals", label: "New Arrivals", icon: SparklesIcon },
];

// ── Computed ──────────────────────────────────────────────
const userInitials = computed(
  () => auth.user?.name?.charAt(0).toUpperCase() ?? "",
);

// ── Search ────────────────────────────────────────────────
function doSearch() {
  const q = searchQuery.value.trim();
  if (!q) return;
  router.push({ name: "search", query: { q } });
  mobileSearchOpen.value = false;
  mobileMenuOpen.value = false;
}

// Sync search input with URL query on search page
watch(
  () => route.query.q,
  (val) => {
    if (route.name === "search") {
      searchQuery.value = val ?? "";
    }
  },
  { immediate: true },
);

// ── Categories ────────────────────────────────────────────
async function fetchCategories() {
  if (categories.value.length) return; // already loaded
  loadingCategories.value = true;
  try {
    const res = await api.get("/categories");
    categories.value = res.data;
  } catch (e) {
    console.error("Failed to load categories:", e);
  } finally {
    loadingCategories.value = false;
  }
}

// Load categories when mega menu opens
watch(categoryMenuOpen, (open) => {
  if (open) fetchCategories();
});

// ── Auth ──────────────────────────────────────────────────
async function handleLogout() {
  await auth.logout();
  dropdownOpen.value = false;
  mobileMenuOpen.value = false;
  router.push({ name: "login" });
}

// ── Click Outside ─────────────────────────────────────────
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
  if (categoryMenuRef.value && !categoryMenuRef.value.contains(e.target)) {
    categoryMenuOpen.value = false;
  }
}

// Close menus on route change
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    mobileSearchOpen.value = false;
    categoryMenuOpen.value = false;
    dropdownOpen.value = false;
  },
);

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>
