<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useMouse, useThrottleFn, useWindowFocus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useMouseStore } from '@/stores/mouse'

const mouseStore = useMouseStore()
const { users, watching } = storeToRefs(mouseStore)

const windowFocus = useWindowFocus()
const { x, y } = useMouse({ touch: false })
const mouse = shallowRef({ x: 0, y: 0 })

const throttleFn = useThrottleFn(() => {
  if (!windowFocus.value) return
  mouse.value = { x: x.value, y: y.value }
  mouseStore.move(mouse.value)
}, 100)

watch([x, y], throttleFn)
</script>

<template>
  <div class="static overflow-hidden">
    <slot />

    <div
      v-if="watching"
      v-for="user in users"
      :key="user.id"
      class="cursor-dot"
      :style="{
        transform: `translate3d(${user.position?.x ?? 0}px, ${user.position?.y ?? 0}px, 0)`,
      }"
    ></div>

    <div class="fixed bg-gray-300 bottom-0 left-0 pointer-events-none">
      <pre>x: {{ x }}, y:{{ y }}</pre>
      <pre>x: {{ mouse.x }}, y:{{ mouse.y }}</pre>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.cursor-dot {
  @apply absolute w-4 h-4 bg-blue-500 rounded-full pointer-events-none;
  transition: transform 250ms linear;
  will-change: transform;
}
</style>
