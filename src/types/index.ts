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

export type VerificationChannel = 'EMAIL' | 'PHONE'

export interface VerificationCodeRequest {
  channel: VerificationChannel
  identifier: string
}

export interface VerificationCodeLoginInput extends VerificationCodeRequest {
  code: string
}

export interface VerificationCodeIssue {
  expiresInSeconds: number
  retryAfterSeconds: number
  developmentCode: string | null
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
