import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CloudUser } from '@/types'

const authApiMock = vi.hoisted(() => ({
  me: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock('@/api/auth', () => ({ authApi: authApiMock }))

import { useAuthStore } from './auth'

const user: CloudUser = {
  id: 'c5bd73cf-72c0-46db-8a2c-dada4d78bcf8',
  username: 'alice',
  displayName: 'Alice',
  email: null,
  phone: null,
  avatarUrl: null,
  lastLoginAt: null,
  createdAt: '2026-08-05T00:00:00Z',
  updatedAt: '2026-08-05T00:00:00Z',
}

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('restores a session only once', async () => {
    authApiMock.me.mockResolvedValue(user)
    const store = useAuthStore()

    await store.restore()
    await store.restore()

    expect(store.user).toEqual(user)
    expect(store.checked).toBe(true)
    expect(authApiMock.me).toHaveBeenCalledTimes(1)
  })

  it('treats a 401 during restore as an anonymous session', async () => {
    authApiMock.me.mockRejectedValue({ isAxiosError: true, response: { status: 401 } })
    const store = useAuthStore()

    await expect(store.restore()).resolves.toBeNull()
    expect(store.user).toBeNull()
    expect(store.checked).toBe(true)
  })

  it('updates user state after login, registration and profile changes', async () => {
    authApiMock.login.mockResolvedValue(user)
    authApiMock.register.mockResolvedValue(user)
    authApiMock.updateProfile.mockResolvedValue({ ...user, displayName: 'Alice Cloud' })
    const store = useAuthStore()

    await store.login({ identifier: 'alice', password: 'Secret123!' })
    expect(store.user).toEqual(user)
    await store.register({ username: 'alice', password: 'Secret123!', displayName: 'Alice', email: null, phone: null })
    await store.updateProfile({ displayName: 'Alice Cloud', email: null, phone: null, avatarUrl: null })
    expect(store.user?.displayName).toBe('Alice Cloud')
  })

  it('keeps local state when the server cannot invalidate the session', async () => {
    authApiMock.logout.mockRejectedValue(new Error('network unavailable'))
    const store = useAuthStore()
    store.user = user

    await expect(store.logout()).rejects.toThrow('network unavailable')
    expect(store.user).toEqual(user)
  })
})
