export function passwordConfirmationError(password: string, confirmation: string): string {
  if (!confirmation) return '请再次输入新密码'
  if (password !== confirmation) return '两次输入的新密码不一致'
  return ''
}
