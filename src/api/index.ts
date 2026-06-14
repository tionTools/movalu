import xior from 'xior'

const baseURL = import.meta.env.VITE_WS_URL

export const api = xior.create({
  baseURL,
  credentials: 'include',
})
