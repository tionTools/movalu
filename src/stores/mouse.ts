import { ref } from 'vue'
import { defineStore } from 'pinia'
import { mousePositionSchema } from '@movalution/contracts'
import type { Cursor, KeyUser, MousePosition } from '@movalution/contracts'
import { useSocketStore } from '@/stores/socket'

export const useMouseStore = defineStore('mouse', () => {
  const socketStore = useSocketStore()
  const users = ref<Cursor[]>([])
  const watching = ref(false)

  function handleSnapshot(cursors: Cursor[]) {
    users.value = cursors.filter((cursor) => mousePositionSchema.safeParse(cursor.position).success)
  }

  function handleMoved({ id, position }: Cursor) {
    const result = mousePositionSchema.safeParse(position)
    if (!result.success) return

    const user = users.value.find((u) => u.id === id)
    if (user) {
      user.position = result.data
    } else {
      users.value.push({ id, position: result.data })
    }
  }

  function handleLeft({ id }: { id: KeyUser }) {
    const index = users.value.findIndex((u) => u.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  socketStore.onConnected((socket) => {
    socket.on('mouse:snapshot', handleSnapshot)
    socket.on('mouse:moved', handleMoved)
    socket.on('mouse:left', handleLeft)
  })

  socketStore.onDisconnected(() => {
    users.value = []
    watching.value = false
  })

  function move(position: MousePosition) {
    socketStore.socket?.emit('mouse:move', position)
  }

  function subscribe() {
    socketStore.socket?.emit('mouse:subscribe')
    watching.value = true
  }

  function unsubscribe() {
    socketStore.socket?.emit('mouse:unsubscribe')
    watching.value = false
    users.value = []
  }

  function toggle() {
    if (watching.value) {
      unsubscribe()
    } else {
      subscribe()
    }
  }

  return { users, watching, move, subscribe, unsubscribe, toggle }
})
