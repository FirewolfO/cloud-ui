import { afterEach, describe, expect, it, vi } from 'vitest'
import { writeClipboardText } from './clipboard'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('writeClipboardText', () => {
  it('uses the Clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await writeClipboardText('uak_test')

    expect(writeText).toHaveBeenCalledWith('uak_test')
  })

  it('falls back to a temporary textarea when the Clipboard API is rejected', async () => {
    const textarea = {
      value: '',
      style: {},
      setAttribute: vi.fn(),
      select: vi.fn(),
      setSelectionRange: vi.fn(),
      remove: vi.fn(),
    }
    const appendChild = vi.fn()
    const execCommand = vi.fn().mockReturnValue(true)
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) },
    })
    vi.stubGlobal('document', {
      createElement: vi.fn().mockReturnValue(textarea),
      body: { appendChild },
      execCommand,
    })

    await writeClipboardText('usk_test')

    expect(textarea.value).toBe('usk_test')
    expect(appendChild).toHaveBeenCalledWith(textarea)
    expect(textarea.select).toHaveBeenCalled()
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(textarea.remove).toHaveBeenCalled()
  })
})
