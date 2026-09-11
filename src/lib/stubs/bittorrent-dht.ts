/**
 * Browser stub for `bittorrent-dht`.
 *
 * torrent-discovery imports `{ Client }` from bittorrent-dht, which WebTorrent
 * replaces with an empty module in the browser (DHT is UDP-only and cannot run
 * over WebRTC). Vite's browser-external stub does not provide the named
 * export, so we supply the empty module ourselves. torrent-discovery guards
 * against a non-function Client, so the DHT path is simply never taken.
 */
export const Client = undefined

export default {}
