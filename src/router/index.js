import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const MainLayout      = () => import('@/layouts/MainLayout.vue')
const Home            = () => import('@/views/Home.vue')
const Products        = () => import('@/views/Products.vue')
const ProductDetail   = () => import('@/views/ProductDetail.vue')
const Categories      = () => import('@/views/Categories.vue')
const Deals           = () => import('@/views/Deals.vue')
const NewArrivals     = () => import('@/views/NewArrivals.vue')
const SearchResults   = () => import('@/views/SearchResults.vue')
const Cart            = () => import('@/views/Cart.vue')
const Wishlist        = () => import('@/views/Wishlist.vue')
const Checkout        = () => import('@/views/Checkout.vue')
const Orders          = () => import('@/views/Orders.vue')
const OrderDetail     = () => import('@/views/OrderDetail.vue')
const Profile         = () => import('@/views/Profile.vue')
const Login           = () => import('@/views/Login.vue')
const Register        = () => import('@/views/Register.vue')
const GoogleCallback  = () => import('@/views/GoogleCallback.vue')
const NotFound        = () => import('@/views/NotFound.vue')

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '',               name: 'home',           component: Home },
            { path: 'products',       name: 'products',       component: Products },
            { path: 'products/:id',   name: 'product-detail', component: ProductDetail },
            { path: 'categories',     name: 'categories',     component: Categories },
            { path: 'deals',          name: 'deals',          component: Deals },
            { path: 'new-arrivals',   name: 'new-arrivals',   component: NewArrivals },
            { path: 'search',         name: 'search',         component: SearchResults },

            // Auth required
            { path: 'cart',           name: 'cart',           component: Cart,        meta: { auth: true } },
            { path: 'wishlist',       name: 'wishlist',       component: Wishlist,    meta: { auth: true } },
            { path: 'checkout',       name: 'checkout',       component: Checkout,    meta: { auth: true } },
            { path: 'orders',         name: 'orders',         component: Orders,      meta: { auth: true } },
            { path: 'orders/:id',     name: 'order-detail',   component: OrderDetail, meta: { auth: true } },
            { path: 'profile',        name: 'profile',        component: Profile,     meta: { auth: true } },
        ],
    },

    // Auth pages (guest only)
    { path: '/login',    name: 'login',    component: Login,    meta: { guest: true } },
    { path: '/register', name: 'register', component: Register, meta: { guest: true } },

    // Google OAuth callback — no auth guard, handles its own state
    {
        path: '/auth/google/callback',
        name: 'google-callback',
        component: GoogleCallback,
    },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta.auth && !auth.isLoggedIn) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.meta.guest && auth.isLoggedIn) {
        return { name: 'home' }
    }
})

export default router
