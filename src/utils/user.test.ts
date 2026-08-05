import { describe, expect, it } from 'vitest'
import { nullable, userInitials } from './user'

describe('user utilities', () => {
  it('builds initials from display name and falls back to username', () => {
    expect(userInitials({ displayName: '云 用户', username: 'cloud' })).toBe('云用')
    expect(userInitials({ displayName: ' ', username: 'alice' })).toBe('AL')
    expect(userInitials(null)).toBe('C')
  })

  it('normalizes optional profile values', () => {
    expect(nullable('  alice@example.com ')).toBe('alice@example.com')
    expect(nullable('   ')).toBeNull()
  })
})
