import { gatewayApi, unwrap } from './client'
import type { ApiCredential, ApiCredentialSecret, PasswordUpdateInput } from '@/types'

export const accountApi = {
  updatePassword: async (input: PasswordUpdateInput) => {
    return unwrap<{ updated: boolean }>(gatewayApi.put('/account/password', input))
  },
  listCredentials: () => unwrap<ApiCredential[]>(gatewayApi.get('/account/api-credentials')),
  createCredential: async (name: string) => {
    return unwrap<ApiCredential>(gatewayApi.post('/account/api-credentials', { name }))
  },
  getCredentialSecret: async (id: string) => {
    return unwrap<ApiCredentialSecret>(gatewayApi.post(`/account/api-credentials/${id}/secret`))
  },
  deleteCredential: async (id: string) => {
    return unwrap<{ deleted: boolean }>(gatewayApi.delete(`/account/api-credentials/${id}`))
  },
}
