export async function writeClipboardText(value: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return
    }
  } catch {
    // Fall through for browsers that expose the API but block it outside a secure context.
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.inset = '0 auto auto 0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, value.length)

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Clipboard copy was rejected')
    }
  } finally {
    textarea.remove()
  }
}
