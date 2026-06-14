<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'

const authStore = useAuthStore()
const { error, pending } = storeToRefs(authStore)
const socketStore = useSocketStore()
const { isAuthorized: socketIsAuthorized } = storeToRefs(socketStore)
</script>

<template>
  <div>
    <!-- <p v-if="isAuthorized">Current user: {{ userId }}</p> -->
    <!-- <p v-else>Not authorized</p> -->

    <p v-if="error">Error: {{ error }}</p>

    <button
      v-if="!socketIsAuthorized"
      type="button"
      :disabled="pending"
      @click="authStore.login('token')"
    >
      {{ pending ? 'Logging in...' : 'Login' }}
    </button>
    <button v-if="socketIsAuthorized" type="button" :disabled="pending" @click="authStore.logout()">
      {{ pending ? 'Logging out...' : 'Logout' }}
    </button>
  </div>
</template>
