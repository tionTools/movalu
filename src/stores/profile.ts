import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ClientToServerEvents } from '@movalution/contracts'
import { useSocketStore } from '@/stores/socket'

type UserProfile = Parameters<Parameters<ClientToServerEvents['profile:get']>[0]>[0]

export const useProfileStore = defineStore('profile', () => {
  const socketStore = useSocketStore()
  const profile = ref<UserProfile | null>(null)

  socketStore.onConnected((socket) => {
    socket.emit('profile:get', (data) => {
      console.log('profile:get', data)
      profile.value = data
    })
  })

  socketStore.onDisconnected(() => {
    profile.value = null
  })

  return { profile }
})
