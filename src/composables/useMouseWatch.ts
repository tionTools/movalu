import { ref } from 'vue'
import { useSocketStore } from '@/stores/socket'

const watching = ref(false)

export function useMouseWatch() {
  const socketStore = useSocketStore()

  function start() {
    socketStore.socket?.emit('mouse:subscribe')
    watching.value = true
  }

  function stop() {
    socketStore.socket?.emit('mouse:unsubscribe')
    watching.value = false
  }

  function toggle() {
    if (watching.value) {
      stop()
    } else {
      start()
    }
  }

  return { watching, start, stop, toggle }
}
