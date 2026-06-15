import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket'

export const usePresenceStore = defineStore('presence', () => {
  const socketStore = useSocketStore()
  const online = ref<number | null>(null)
  const isReady = computed(() => online.value !== null)

  function handleOnline(count: number) {
    online.value = count
  }

  socketStore.onConnected((socket) => {
    socket.on('presence:online', handleOnline)
  })

  socketStore.onDisconnected(() => {
    online.value = null
  })

  return { online, isReady }
})
