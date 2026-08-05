import { describe, expect, it } from 'vitest'
import { normalizeLoginIdentifier, validateLoginIdentifier } from './loginIdentifier'

describe('login identifiers', () => {
  it('normalizes email addresses and international phone numbers', () => {
    expect(normalizeLoginIdentifier('email', ' Alice@Example.COM ')).toBe('alice@example.com')
    expect(normalizeLoginIdentifier('phone', '00 86 (138) 0013-8000')).toBe('+8613800138000')
  })

  it('validates the selected login method', () => {
    expect(validateLoginIdentifier('username', 'alice')).toBeNull()
    expect(validateLoginIdentifier('email', 'alice@example.com')).toBeNull()
    expect(validateLoginIdentifier('phone', '+8613800138000')).toBeNull()
  })

  it('rejects identifiers that do not match the selected method', () => {
    expect(validateLoginIdentifier('username', 'alice@example.com')).toBe('账号格式不正确')
    expect(validateLoginIdentifier('email', 'alice')).toBe('请输入有效邮箱')
    expect(validateLoginIdentifier('phone', '13800138000')).toContain('国家代码')
  })
})
