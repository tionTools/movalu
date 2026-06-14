<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSocketStore } from '@/stores/socket'
import MouseObserve from '@/components/MouseObserve.vue'

const route = useRoute()
const socketStore = useSocketStore()

// connect() in setup, not onMounted: child onMounted hooks run before the
// parent's, so the socket must exist before children mount and attach listeners.
socketStore.connect()

onUnmounted(() => {
  socketStore.disconnect()
})
</script>

<template>
  <MouseObserve class="min-h-screen flex flex-col">
    <Header :routeName="route.name?.toString()" />

    <main class="flex-1">
      <RouterView />
    </main>

    <Footer />
  </MouseObserve>
</template>

<style scoped>
/* .main-bg {
  background-image:
    linear-gradient(rgba(237, 237, 237, 0.5) 1px, transparent 1px),
    linear-gradient(to right, rgba(237, 237, 237, 0.5) 1px, transparent 1px);
  background-size: 75px 75px;
} */
</style>
