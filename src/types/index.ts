export interface CloudUser {
  id: string
  username: string
  displayName: string
  email: string | null
  phone: string | null
  avatarUrl: string | null
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginInput {
  identifier: string
  password: string
}

export interface RegisterInput {
  username: string
  password: string
  displayName: string
  email: string | null
  phone: string | null
}

export interface ProfileInput {
  displayName: string
  email: string | null
  phone: string | null
  avatarUrl: string | null
}
