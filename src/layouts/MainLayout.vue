<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header :routeName="route.name?.toString()" />

    <main class="flex-1">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* .main-bg {
  background-image:
    linear-gradient(rgba(237, 237, 237, 0.5) 1px, transparent 1px),
    linear-gradient(to right, rgba(237, 237, 237, 0.5) 1px, transparent 1px);
  background-size: 75px 75px;
} */
</style>
