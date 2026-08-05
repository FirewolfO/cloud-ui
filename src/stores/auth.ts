import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import { isUnauthorized } from '@/api/client'
import type { CloudUser, LoginInput, ProfileInput, RegisterInput } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as CloudUser | null,
    checked: false,
  }),
  actions: {
    async restore() {
      if (this.checked) return this.user
      try {
        this.user = await authApi.me()
      } catch (error) {
        if (!isUnauthorized(error)) throw error
        this.user = null
      } finally {
        this.checked = true
      }
      return this.user
    },
    async login(input: LoginInput) {
      this.user = await authApi.login(input)
      this.checked = true
    },
    async register(input: RegisterInput) {
      this.user = await authApi.register(input)
      this.checked = true
    },
    async logout() {
      await authApi.logout()
      this.user = null
      this.checked = true
    },
    async updateProfile(input: ProfileInput) {
      this.user = await authApi.updateProfile(input)
    },
  },
})
