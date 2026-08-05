import { describe, expect, it } from 'vitest'
import { authenticationRedirect } from './authGuard'

describe('authentication route policy', () => {
  it('sends anonymous users to auth and preserves the destination', () => {
    expect(authenticationRedirect({ name: 'profile', fullPath: '/profile', meta: { requiresAuth: true } }, false))
      .toEqual({ name: 'auth', query: { redirect: '/profile' } })
  })

  it('keeps authenticated users out of the auth page', () => {
    expect(authenticationRedirect({ name: 'auth', fullPath: '/auth', meta: {} }, true))
      .toEqual({ name: 'home' })
  })

  it('allows navigation when no redirect is required', () => {
    expect(authenticationRedirect({ name: 'home', fullPath: '/', meta: { requiresAuth: true } }, true))
      .toBeUndefined()
  })
})
