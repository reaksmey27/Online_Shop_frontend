<template>
    <router-view />
    <LoginModal />
    <RegisterModal />
</template>

<script setup>
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'
</script>
