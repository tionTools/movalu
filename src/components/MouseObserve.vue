<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useMouse, useThrottleFn, useWindowFocus } from '@vueuse/core'
import { useSocketStore } from '@/stores/socket'
import { useMouseWatch } from '@/composables/useMouseWatch'
import type { MousePosition, UsersSnapshot } from '@/types/socket'

const socketStore = useSocketStore()
const { watching, stop } = useMouseWatch()
const windowFocus = useWindowFocus()
const { x, y } = useMouse({ touch: false })
const mouse = shallowRef({ x: 0, y: 0 })
const users = ref<UsersSnapshot[]>([])

const throttleFn = useThrottleFn(() => {
  if (!windowFocus.value) return
  mouse.value = { x: x.value, y: y.value }
  socketStore.socket?.emit('mouse:move', mouse.value)
}, 100)

const stopMouseWatch = watch([x, y], throttleFn)

const stopWatchingWatch = watch(watching, (isWatching) => {
  if (!isWatching) {
    users.value = []
  }
})

function handleUsersMouse(usersSnapshot: UsersSnapshot[]) {
  console.log('snapshot', usersSnapshot)
  users.value = usersSnapshot
}

function handleUserMouse({ id, position }: { id: string; position?: MousePosition }) {
  const user = users.value.find((u) => u.id === id)
  if (user) {
    user.position = position
  } else {
    users.value.push({ id, position })
  }
}

function handleUserLeft({ id }: { id: string }) {
  const userIndex = users.value.findIndex((u) => u.id === id)
  if (userIndex !== -1) {
    users.value.splice(userIndex, 1)
  }
}

onMounted(() => {
  const s = socketStore.socket
  s?.on('users:mouse', handleUsersMouse)
  s?.on('user:mouse', handleUserMouse)
  s?.on('user:left', handleUserLeft)
})

onUnmounted(() => {
  stopMouseWatch()
  stopWatchingWatch()

  const s = socketStore.socket
  s?.off('users:mouse', handleUsersMouse)
  s?.off('user:mouse', handleUserMouse)
  s?.off('user:left', handleUserLeft)

  stop()
})
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
