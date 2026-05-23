import { describe, it, expect } from 'vitest'
import {
  formatFileSize,
  isFileAccepted,
  isFileSizeValid,
  isImageFile,
  getFileExtension,
  generateId,
} from '../utils'

const makeFile = (name: string, type: string, size = 1000): File =>
  new File(['x'.repeat(size)], name, { type })

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })
  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
  })
  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
  })
  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })
  it('formats decimal sizes', () => {
    expect(formatFileSize(1500)).toBe('1.5 KB')
  })
})

describe('isFileAccepted', () => {
  it('accepts any file when accept is empty', () => {
    const file = makeFile('doc.pdf', 'application/pdf')
    expect(isFileAccepted(file, [])).toBe(true)
  })

  it('accepts exact MIME type', () => {
    const file = makeFile('photo.jpg', 'image/jpeg')
    expect(isFileAccepted(file, ['image/jpeg'])).toBe(true)
  })

  it('rejects non-matching MIME type', () => {
    const file = makeFile('doc.pdf', 'application/pdf')
    expect(isFileAccepted(file, ['image/jpeg'])).toBe(false)
  })

  it('accepts wildcard MIME type (image/*)', () => {
    const file = makeFile('photo.png', 'image/png')
    expect(isFileAccepted(file, ['image/*'])).toBe(true)
  })

  it('rejects non-matching wildcard', () => {
    const file = makeFile('doc.pdf', 'application/pdf')
    expect(isFileAccepted(file, ['image/*'])).toBe(false)
  })

  it('accepts by extension (.pdf)', () => {
    const file = makeFile('document.pdf', 'application/octet-stream')
    expect(isFileAccepted(file, ['.pdf'])).toBe(true)
  })

  it('extension matching is case-insensitive', () => {
    const file = makeFile('document.PDF', 'application/octet-stream')
    expect(isFileAccepted(file, ['.pdf'])).toBe(true)
  })

  it('accepts if any of multiple types match', () => {
    const file = makeFile('photo.png', 'image/png')
    expect(isFileAccepted(file, ['.pdf', 'image/*'])).toBe(true)
  })
})

describe('isFileSizeValid', () => {
  it('accepts file within size limits', () => {
    const file = makeFile('file.jpg', 'image/jpeg', 1000)
    expect(isFileSizeValid(file, 2000, 500)).toEqual({ valid: true })
  })

  it('rejects file over max size', () => {
    const file = makeFile('file.jpg', 'image/jpeg', 3000)
    const result = isFileSizeValid(file, 2000)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/too large/)
  })

  it('rejects file under min size', () => {
    const file = makeFile('file.jpg', 'image/jpeg', 100)
    const result = isFileSizeValid(file, undefined, 500)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/too small/)
  })

  it('accepts when no size limits set', () => {
    const file = makeFile('file.jpg', 'image/jpeg', 999999)
    expect(isFileSizeValid(file)).toEqual({ valid: true })
  })
})

describe('isImageFile', () => {
  it('identifies image files', () => {
    expect(isImageFile(makeFile('photo.jpg', 'image/jpeg'))).toBe(true)
    expect(isImageFile(makeFile('photo.png', 'image/png'))).toBe(true)
    expect(isImageFile(makeFile('photo.gif', 'image/gif'))).toBe(true)
  })

  it('rejects non-image files', () => {
    expect(isImageFile(makeFile('doc.pdf', 'application/pdf'))).toBe(false)
    expect(isImageFile(makeFile('data.csv', 'text/csv'))).toBe(false)
  })
})

describe('getFileExtension', () => {
  it('extracts and uppercases extension', () => {
    expect(getFileExtension('document.pdf')).toBe('PDF')
    expect(getFileExtension('photo.jpg')).toBe('JPG')
    expect(getFileExtension('archive.tar.gz')).toBe('GZ')
  })

  it('returns empty string for no extension', () => {
    expect(getFileExtension('Makefile')).toBe('')
  })
})

describe('generateId', () => {
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })

  it('generates string IDs', () => {
    expect(typeof generateId()).toBe('string')
  })
})
