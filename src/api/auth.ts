import { api, gatewayApi, unwrap } from './client'
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
  me: () => unwrap<CloudUser>(gatewayApi.get('/auth/me')),
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
    return unwrap<{ loggedOut: boolean }>(gatewayApi.post('/auth/logout'))
  },
  updateProfile: async (input: ProfileInput) => {
    return unwrap<CloudUser>(gatewayApi.put('/account/profile', input))
  },
}
