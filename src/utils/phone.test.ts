import { describe, expect, it } from 'vitest'
import { composePhoneNumber, splitPhoneNumber } from './phone'

describe('international phone helpers', () => {
  it('defaults an empty or local number to mainland China', () => {
    expect(splitPhoneNumber('')).toEqual({ callingCode: '+86', nationalNumber: '' })
    expect(splitPhoneNumber('138 0013-8000')).toEqual({ callingCode: '+86', nationalNumber: '13800138000' })
  })

  it('uses the longest matching calling code', () => {
    expect(splitPhoneNumber('+852 6123 4567')).toEqual({ callingCode: '+852', nationalNumber: '61234567' })
    expect(splitPhoneNumber('+1 (415) 555-0100')).toEqual({ callingCode: '+1', nationalNumber: '4155550100' })
  })

  it('composes an E.164 value from the selected code and local digits', () => {
    expect(composePhoneNumber('+86', '138 0013 8000')).toBe('+8613800138000')
    expect(composePhoneNumber('+81', '')).toBe('')
  })
})
