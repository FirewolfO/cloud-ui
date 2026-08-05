import type { CloudUser } from '@/types'

export function userInitials(user: Pick<CloudUser, 'displayName' | 'username'> | null) {
  const source = (user?.displayName.trim() || user?.username.trim() || 'C').replace(/\s+/g, '')
  return Array.from(source).slice(0, 2).join('').toUpperCase()
}

export function nullable(value: string) {
  const normalized = value.trim()
  return normalized || null
}
