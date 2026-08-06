import { describe, expect, it } from 'vitest'
import { passwordConfirmationError } from './password'

describe('passwordConfirmationError', () => {
  it('requires a confirmation', () => {
    expect(passwordConfirmationError('Updated123!', '')).toBe('请再次输入新密码')
  })

  it('rejects a different confirmation', () => {
    expect(passwordConfirmationError('Updated123!', 'Different123!')).toBe('两次输入的新密码不一致')
  })

  it('accepts matching passwords', () => {
    expect(passwordConfirmationError('Updated123!', 'Updated123!')).toBe('')
  })
})
