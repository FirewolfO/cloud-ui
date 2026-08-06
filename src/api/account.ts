import { api, unwrap } from './client'
import { ensureCsrf } from './auth'
import type { ApiCredential } from '@/types'

export const accountApi = {
  listCredentials: () => unwrap<ApiCredential[]>(api.get('/account/api-credentials')),
  createCredential: async (name: string) => {
    await ensureCsrf()
    return unwrap<ApiCredential>(api.post('/account/api-credentials', { name }))
  },
  deleteCredential: async (id: string) => {
    await ensureCsrf()
    return unwrap<{ deleted: boolean }>(api.delete(`/account/api-credentials/${id}`))
  },
}
