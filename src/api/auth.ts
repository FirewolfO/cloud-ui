import { api, unwrap } from './client'
import type { CloudUser, LoginInput, ProfileInput, RegisterInput } from '@/types'

export async function ensureCsrf() {
  await api.get('/auth/csrf')
}

export const authApi = {
  me: () => unwrap<CloudUser>(api.get('/auth/me')),
  login: async (input: LoginInput) => {
    await ensureCsrf()
    return unwrap<CloudUser>(api.post('/auth/login', input))
  },
  register: async (input: RegisterInput) => {
    await ensureCsrf()
    return unwrap<CloudUser>(api.post('/auth/register', input))
  },
  logout: async () => {
    await ensureCsrf()
    return unwrap<{ loggedOut: boolean }>(api.post('/auth/logout'))
  },
  updateProfile: async (input: ProfileInput) => {
    await ensureCsrf()
    return unwrap<CloudUser>(api.put('/account/profile', input))
  },
}
