<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMouseStore } from '@/stores/mouse'

const mouseStore = useMouseStore()
const { watching } = storeToRefs(mouseStore)
</script>

<template>
  <div>
    <label for="mouse-watch">Show cursor</label>
    <input type="checkbox" id="mouse-watch" :checked="watching" @change="mouseStore.toggle" />
  </div>
</template>
