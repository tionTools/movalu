<script setup lang="ts">
import { useMouseWatch } from '@/composables/useMouseWatch'

const { watching, toggle } = useMouseWatch()
</script>

<template>
  <label for="mouse-watch">Online</label>
  <input type="checkbox" id="mouse-watch" :checked="watching" @change="toggle" />
</template>
