<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modal.isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @keydown.esc="modal.close()"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="modal.close()" />

        <!-- Modal -->
        <Transition name="pop" appear>
          <div class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[90vh]">

            <!-- Close button -->
            <button
              type="button"
              @click="modal.close()"
              class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-gray-800 flex items-center justify-center shadow-sm transition-colors"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>

            <!-- Left: image panel -->
            <div
              class="hidden sm:flex sm:w-2/5 flex-col justify-between p-8 text-white relative overflow-hidden bg-cover bg-center"
              style="background-image: linear-gradient(160deg, rgba(15,23,42,.55), rgba(37,99,235,.55)), url('/images/auth-hero.jpg'); background-color: #0f172a;"
            >
              <!-- Decorative pattern (shows even if auth-hero.jpg hasn't been added yet) -->
              <svg class="absolute -bottom-10 -right-10 w-56 h-56 opacity-20" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="white" stroke-width="1.5" stroke-dasharray="4 4" />
                <circle cx="50" cy="50" r="30" stroke="white" stroke-width="1.5" />
              </svg>

              <div class="relative z-10">
                <span class="text-3xl">⚽</span>
                <h2 class="text-2xl font-black mt-4 tracking-tight leading-snug">
                  Welcome back to<br />the pitch.
                </h2>
                <p class="text-white/70 text-sm mt-3 leading-relaxed">
                  Sign in for faster checkout, order tracking, and your saved wishlist.
                </p>
              </div>

              <p class="relative z-10 text-white/50 text-xs">
                New here? <a href="#" @click.prevent="switchToRegister" class="text-white font-semibold underline underline-offset-2">Create an account</a>
              </p>
            </div>

            <!-- Right: form -->
            <div class="w-full sm:w-3/5 p-6 sm:p-8 overflow-y-auto">
              <div class="mb-6">
                <h3 class="text-xl font-black text-gray-900 tracking-tight">Sign In</h3>
                <p class="text-gray-400 text-sm mt-1">Welcome back — enter your details below.</p>
              </div>

              <LoginForm @success="handleSuccess" />
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useLoginModalStore } from '@/stores/loginModal'
import { useRegisterModalStore } from '@/stores/registerModal'
import LoginForm from '@/components/auth/LoginForm.vue'

const modal         = useLoginModalStore()
const registerModal = useRegisterModalStore()
const router        = useRouter()

function handleSuccess() {
  const redirect = modal.redirectTo
  modal.close()
  if (redirect) router.push(redirect)
}

function switchToRegister() {
  const redirect = modal.redirectTo
  modal.close()
  registerModal.open(redirect)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: transform .2s ease, opacity .2s ease; }
.pop-leave-active { transition: transform .15s ease, opacity .15s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
</style>
