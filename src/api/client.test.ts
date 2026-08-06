import { describe, expect, it } from 'vitest'
import { api, gatewayApi } from './client'

describe('API clients', () => {
  it('keeps sign-in entry points separate from authenticated Gateway requests', () => {
    expect(api.defaults.baseURL).toBe('/api/v1')
    expect(gatewayApi.defaults.baseURL).toBe('/api/open/signin')
  })
})
