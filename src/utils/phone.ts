export interface CountryCallingCode {
  code: string
  country: string
  label: string
}

export const COUNTRY_CALLING_CODES: CountryCallingCode[] = [
  { country: 'CN', code: '+86', label: '中国大陆' },
  { country: 'HK', code: '+852', label: '中国香港' },
  { country: 'MO', code: '+853', label: '中国澳门' },
  { country: 'TW', code: '+886', label: '中国台湾' },
  { country: 'US', code: '+1', label: '美国 / 加拿大' },
  { country: 'JP', code: '+81', label: '日本' },
  { country: 'KR', code: '+82', label: '韩国' },
  { country: 'SG', code: '+65', label: '新加坡' },
  { country: 'GB', code: '+44', label: '英国' },
  { country: 'DE', code: '+49', label: '德国' },
  { country: 'FR', code: '+33', label: '法国' },
  { country: 'AU', code: '+61', label: '澳大利亚' },
]

export const DEFAULT_CALLING_CODE = '+86'

export function splitPhoneNumber(value: string) {
  const normalized = value.replace(/[\s()-]/g, '')
  const match = [...COUNTRY_CALLING_CODES]
    .sort((left, right) => right.code.length - left.code.length)
    .find((item) => normalized.startsWith(item.code))
  if (!match) return { callingCode: DEFAULT_CALLING_CODE, nationalNumber: normalized.replace(/^\+/, '') }
  return { callingCode: match.code, nationalNumber: normalized.slice(match.code.length) }
}

export function composePhoneNumber(callingCode: string, nationalNumber: string) {
  const digits = nationalNumber.replace(/\D/g, '')
  return digits ? `${callingCode}${digits}` : ''
}
