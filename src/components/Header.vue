<script setup lang="ts">
import MouseWatchToggle from '@/components/mouse/MouseWatchToggle.vue'
import AuthPanel from '@/components/AuthPanel.vue'
import Presence from '@/components/Presence.vue'
</script>

<template>
  <header class="flex items-center justify-between p-4">
    <AuthPanel />
    <MouseWatchToggle />
    <Presence />
  </header>
</template>
