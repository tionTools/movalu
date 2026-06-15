import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api'
import { useSocketStore } from '@/stores/socket'
import { loginResponseSchema, validationErrorSchema, type LoginInput } from '@movalution/contracts'

export const useAuthStore = defineStore('auth', () => {
  const error = ref<string | null>(null)
  const pending = ref(false)

  async function login(token: LoginInput['token']) {
    pending.value = true
    error.value = null

    try {
      const body: LoginInput = { token }
      const res = await api.post('login', body)
      const data = loginResponseSchema.parse(res.data)

      if (data.status === 'ok') {
        useSocketStore().reconnect()
      } else {
        error.value = 'Authorization failed'
      }
    } catch (e) {
      error.value = resolveError(e)
    } finally {
      pending.value = false
    }
  }

  function reset() {
    error.value = null
  }

  async function logout() {
    pending.value = true
    error.value = null

    try {
      await api.post('logout')
      reset()
      useSocketStore().reconnect()
    } catch (e) {
      error.value = resolveError(e)
    } finally {
      pending.value = false
    }
  }

  return { error, pending, login, reset, logout }
})

function resolveError(e: unknown) {
  const body = (e as { response?: { data?: unknown } }).response?.data
  const validation = validationErrorSchema.safeParse(body)
  if (validation.success) {
    return validation.data.message
  }
  return e instanceof Error ? e.message : 'Request failed'
}
