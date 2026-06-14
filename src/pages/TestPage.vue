<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/stores/socket'

const { online, userId } = storeToRefs(useSocketStore())
</script>

<template>
  <div>
    <h1 class="text-red-500">{{ userId ?? 'Unknown' }} {{ online }}</h1>
  </div>
</template>
