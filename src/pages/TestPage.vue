<script setup lang="ts">
import { io } from 'socket.io-client'
import { onUnmounted, ref, shallowRef, watch } from 'vue'
import { useMouse, useThrottleFn } from '@vueuse/core'

type UserProfile = {
  id: string
  name: string
}
type MousePosition = {
  x: number
  y: number
}
type UsersSnapshot = {
  id: string
  position?: MousePosition
}

const { x, y } = useMouse({ touch: false })
const online = ref(0)
const userId = ref<string>()
const flag = ref(false)
const mouse = shallowRef({ x: 0, y: 0 })
const users = ref<UsersSnapshot[]>([])
// const windowFocus = useWindowFocus()
const socket = io(import.meta.env.VITE_WS_URL)

socket.emit('user:getProfile', (profile: UserProfile) => {
  console.log('user:getProfile', profile)
  userId.value = socket.id
})

// socket.on('connect', () => {
//   console.log('Connected to server')
// })

const throttleFn = useThrottleFn(() => {
  mouse.value = { x: x.value, y: y.value }
  socket.emit('mouse:move', mouse.value)
}, 100)

const stopMouseWatch = watch([x, y], throttleFn)

const stopFlagWatch = watch(flag, (newValue) => {
  if (newValue) {
    socket.emit('mouse:subscribe')
  } else {
    socket.emit('mouse:unsubscribe')
    users.value = []
  }
})

// const stopWindowFocusWatch = watch(windowFocus, (newValue) => {
//   if (newValue && flag.value) {
//     socket.emit('mouse:subscribe')
//   } else {
//     socket.emit('mouse:unsubscribe')
//     users.value = []
//   }
// })

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

function handleUsersOnline(count: number) {
  online.value = count
}

socket.on('users:mouse', handleUsersMouse)
socket.on('user:mouse', handleUserMouse)
socket.on('user:left', handleUserLeft)
socket.on('users:online', handleUsersOnline)

onUnmounted(() => {
  stopMouseWatch()
  stopFlagWatch()
  // stopWindowFocusWatch()

  socket.off('users:mouse', handleUsersMouse)
  socket.off('user:mouse', handleUserMouse)
  socket.off('user:left', handleUserLeft)
  socket.off('users:online', handleUsersOnline)

  socket.emit('mouse:unsubscribe')
  socket.disconnect()
})
</script>

<template>
  <div class="static overflow-hidden">
    <div
      v-if="flag"
      v-for="user in users"
      :key="user.id"
      class="cursor-dot"
      :style="{
        transform: `translate3d(${user.position?.x ?? 0}px, ${user.position?.y ?? 0}px, 0)`,
      }"
    ></div>

    <h1 class="text-red-500">{{ userId ?? 'Unknown' }} {{ online }}</h1>
    <label for="online">Online</label>
    <input type="checkbox" id="online" @change="flag = !flag" />
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
