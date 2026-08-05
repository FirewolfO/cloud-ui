import { api, unwrap } from './client'
import type {
  CloudUser,
  LoginInput,
  ProfileInput,
  RegisterInput,
  VerificationCodeIssue,
  VerificationCodeLoginInput,
  VerificationCodeRequest,
} from '@/types'

export async function ensureCsrf() {
  await api.get('/auth/csrf')
}

export const authApi = {
  me: () => unwrap<CloudUser>(api.get('/auth/me')),
  login: async (input: LoginInput) => {
    await ensureCsrf()
    return unwrap<CloudUser>(api.post('/auth/login', input))
  },
  sendVerificationCode: async (input: VerificationCodeRequest) => {
    await ensureCsrf()
    return unwrap<VerificationCodeIssue>(api.post('/auth/verification-codes', input))
  },
  loginWithCode: async (input: VerificationCodeLoginInput) => {
    await ensureCsrf()
    return unwrap<CloudUser>(api.post('/auth/code-login', input))
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
