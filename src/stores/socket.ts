import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import type { AppSocket } from '@/types/socket'

export const useSocketStore = defineStore('socket', () => {
  const socket = shallowRef<AppSocket | null>(null)
  const connected = ref(false)
  const connectError = ref<string | null>(null)
  const isAuthorized = ref(false)
  const userId = ref<string>()

  const online = ref(0)

  function connect() {
    if (socket.value) return

    const s: AppSocket = io(import.meta.env.VITE_WS_URL, {
      withCredentials: true,
    })
    socket.value = s

    s.on('connect', () => {
      connected.value = true
      connectError.value = null
      isAuthorized.value = true
      userId.value = s.id
    })
    s.on('disconnect', () => {
      connected.value = false
    })
    s.on('connect_error', (err) => {
      console.error('Connection error:', err)
      connected.value = false

      const code = (err as Error & { data?: { code?: number } }).data?.code
      if (code === 401 || code === 403) {
        isAuthorized.value = false
        return
      }

      if (s.active) return
      connectError.value = err.message
    })

    s.emit('user:getProfile', (profile) => {
      console.log('user:getProfile', profile)
      userId.value = s.id
    })

    s.on('users:online', (count) => {
      online.value = count
    })
  }

  function disconnect() {
    socket.value?.disconnect()
    socket.value = null
    connected.value = false
    connectError.value = null
    isAuthorized.value = false
  }

  function reconnect() {
    if (!socket.value) {
      connect()
      return
    }
    connectError.value = null
    isAuthorized.value = false
    socket.value.disconnect()
    socket.value.connect()
  }

  return {
    socket,
    connected,
    connectError,
    isAuthorized,
    userId,
    online,
    connect,
    disconnect,
    reconnect,
  }
})
