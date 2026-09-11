/// <reference types="vite/client" />

declare module '*.css'

declare module 'webtorrent' {
  const WebTorrent: any
  export default WebTorrent
}
