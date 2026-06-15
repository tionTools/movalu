import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@movalution/contracts'

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>
