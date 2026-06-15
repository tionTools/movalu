<script setup lang="ts">
import { usePresenceStore } from '@/stores/presence'

const presenceStore = usePresenceStore()
</script>

<template>
  <div>
    <h1 class="text-red-500">{{ presenceStore.online }}</h1>
  </div>
</template>
