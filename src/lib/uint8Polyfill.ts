/**
 * Polyfill for the TC39 Uint8Array base64/hex methods (ES2025, baseline ~2025).
 *
 * `uint8-util` v2 (a WebTorrent dependency) calls `bytes.toBase64()`,
 * `bytes.toHex()` and `Uint8Array.fromHex()`. Browsers that predate the spec
 * throw "bytes.toBase64 is not a function" when the WebTorrent client boots.
 *
 * This module is imported first in main.tsx, before any dynamic import of the
 * torrent client, and only defines methods that are missing.
 */

const HEX_CHARS = '0123456789abcdef'
const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64_LOOKUP: Record<string, number> = {}
for (let i = 0; i < B64_CHARS.length; i++) B64_LOOKUP[B64_CHARS[i]!] = i

if (typeof Uint8Array !== 'undefined') {
  const proto = Uint8Array.prototype as unknown as Record<string, unknown>

  if (typeof proto.toHex !== 'function') {
    proto.toHex = function toHex(this: Uint8Array): string {
      let out = ''
      for (let i = 0; i < this.length; i++) {
        out += HEX_CHARS[this[i]! >> 4] + HEX_CHARS[this[i]! & 0xf]
      }
      return out
    }
  }

  if (typeof proto.toBase64 !== 'function') {
    proto.toBase64 = function toBase64(this: Uint8Array): string {
      let out = ''
      for (let i = 0; i < this.length; i += 3) {
        const b0 = this[i]!
        const b1 = this[i + 1]
        const b2 = this[i + 2]
        out += B64_CHARS[b0 >> 2]
        out += B64_CHARS[((b0 & 0x3) << 4) | ((b1 ?? 0) >> 4)]
        if (b1 === undefined) {
          out += '=='
        } else {
          out += B64_CHARS[((b1 & 0xf) << 2) | ((b2 ?? 0) >> 6)]
          if (b2 === undefined) out += '='
        }
      }
      return out
    }
  }

  const Ctor = Uint8Array as unknown as Record<string, unknown>

  if (typeof Ctor.fromHex !== 'function') {
    Ctor.fromHex = function fromHex(hex: string): Uint8Array {
      if (typeof hex !== 'string' || hex.length % 2 !== 0) {
        throw new SyntaxError('Uint8Array.fromHex: input must be an even-length string')
      }
      const out = new Uint8Array(hex.length / 2)
      for (let i = 0; i < out.length; i++) {
        const hi = Number.parseInt(hex[2 * i]!, 16)
        const lo = Number.parseInt(hex[2 * i + 1]!, 16)
        if (Number.isNaN(hi) || Number.isNaN(lo)) {
          throw new SyntaxError('Uint8Array.fromHex: invalid hex character')
        }
        out[i] = hi * 16 + lo
      }
      return out
    }
  }

  if (typeof Ctor.fromBase64 !== 'function') {
    Ctor.fromBase64 = function fromBase64(b64: string): Uint8Array {
      if (typeof b64 !== 'string') {
        throw new SyntaxError('Uint8Array.fromBase64: input must be a string')
      }
      // Forgiving decode: strip ASCII whitespace, stop at padding.
      const clean = b64.replace(/[\t\n\f\r ]/g, '')
      const bytes: number[] = []
      let acc = 0
      let bits = 0
      for (const ch of clean) {
        if (ch === '=') break
        const v = B64_LOOKUP[ch]
        if (v === undefined) {
          throw new SyntaxError('Uint8Array.fromBase64: invalid base64 character')
        }
        acc = (acc << 6) | v
        bits += 6
        if (bits >= 8) {
          bits -= 8
          bytes.push((acc >> bits) & 0xff)
        }
      }
      return Uint8Array.from(bytes)
    }
  }
}

export {}
