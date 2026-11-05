<script setup lang="ts">
import { useSocketStore } from '@/stores/socket'
import type { ChangeInput, Target } from '@movalution/contracts'

const props = defineProps<{
  target: Target
}>()

const socketStore = useSocketStore()

function cast(option: ChangeInput['option']) {
  const input: ChangeInput = {
    target: props.target,
    action: 'cast',
    option,
  }

  socketStore.socket?.emit('vote:cast', input)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <button type="button" :disabled="!socketStore.connected" @click="cast('+')">+</button>
    <button type="button" :disabled="!socketStore.connected" @click="cast('-')">-</button>
  </div>
</template>
