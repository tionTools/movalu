<script setup lang="ts">
import { useMouseWatch } from '@/composables/useMouseWatch'

const { watching, toggle } = useMouseWatch()
</script>

<template>
  <div>
    <label for="mouse-watch">Show cursor</label>
    <input type="checkbox" id="mouse-watch" :checked="watching" @change="toggle" />
  </div>
</template>
