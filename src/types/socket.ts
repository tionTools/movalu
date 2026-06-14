import type { Socket } from 'socket.io-client'

export type UserProfile = {
  id: string
  name: string
}

export type MousePosition = {
  x: number
  y: number
}

export type UsersSnapshot = {
  id: string
  position?: MousePosition
}

export type ServerToClientEvents = {
  'users:mouse': (users: UsersSnapshot[]) => void
  'user:mouse': (payload: { id: string; position?: MousePosition }) => void
  'user:left': (payload: { id: string }) => void
  'users:online': (count: number) => void
}

export type ClientToServerEvents = {
  'user:getProfile': (cb: (profile: UserProfile) => void) => void
  'mouse:move': (position: MousePosition) => void
  'mouse:subscribe': () => void
  'mouse:unsubscribe': () => void
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
