export type LoginMethod = 'username' | 'phone' | 'email'

export const LOGIN_METHOD_OPTIONS: Array<{ label: string; value: LoginMethod }> = [
  { label: '账号', value: 'username' },
  { label: '手机号', value: 'phone' },
  { label: '邮箱', value: 'email' },
]

const USERNAME_PATTERN = /^[A-Za-z][A-Za-z0-9_.-]{2,31}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/

export function normalizeLoginIdentifier(method: LoginMethod, input: string) {
  const value = input.trim()
  if (method === 'email') return value.toLowerCase()
  if (method === 'phone') {
    const compact = value.replace(/[\s()-]/g, '')
    return compact.startsWith('00') ? `+${compact.slice(2)}` : compact
  }
  return value
}

export function validateLoginIdentifier(method: LoginMethod, input: string) {
  const value = normalizeLoginIdentifier(method, input)
  if (!value) {
    return method === 'phone' ? '请输入手机号' : method === 'email' ? '请输入邮箱' : '请输入账号'
  }
  if (method === 'username' && !USERNAME_PATTERN.test(value)) {
    return '账号格式不正确'
  }
  if (method === 'email' && (value.length > 254 || !EMAIL_PATTERN.test(value))) {
    return '请输入有效邮箱'
  }
  if (method === 'phone' && !PHONE_PATTERN.test(value)) {
    return '请输入带国家代码的手机号，例如 +8613800138000'
  }
  return null
}
