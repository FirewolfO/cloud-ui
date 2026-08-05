import { describe, expect, it, vi } from 'vitest'
import { createRequestId } from './requestId'

describe('request ID generation', () => {
  it('uses randomUUID when the browser provides it', () => {
    const randomUUID = vi.fn(() => '38f3bd58-46c4-4a55-a510-5fe331c38c17')
    const provider = { randomUUID, getRandomValues: vi.fn() } as unknown as Crypto

    expect(createRequestId(provider)).toBe('38f3bd58-46c4-4a55-a510-5fe331c38c17')
    expect(randomUUID).toHaveBeenCalledOnce()
  })

  it('builds a UUID with getRandomValues when randomUUID is unavailable', () => {
    const provider = {
      getRandomValues: (bytes: Uint8Array) => {
        bytes.set(Array.from({ length: 16 }, (_, index) => index))
        return bytes
      },
    } as unknown as Crypto

    expect(createRequestId(provider)).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f')
  })

  it('still returns a valid correlation ID without Web Crypto', () => {
    expect(createRequestId(null)).toMatch(/^fallback-[a-z0-9]+-[a-z0-9]+$/)
  })
})
