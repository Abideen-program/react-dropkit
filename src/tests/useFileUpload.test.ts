import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from '../hooks/useFileUpload'

const makeFile = (name: string, type: string, size = 1000): File =>
  new File(['x'.repeat(size)], name, { type })

describe('useFileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with empty files', () => {
    const { result } = renderHook(() => useFileUpload())
    expect(result.current.files).toHaveLength(0)
  })

  it('adds files correctly', () => {
    const { result } = renderHook(() => useFileUpload())
    act(() => {
      result.current.addFiles([makeFile('photo.jpg', 'image/jpeg')])
    })
    expect(result.current.files).toHaveLength(1)
    expect(result.current.files[0].file.name).toBe('photo.jpg')
    expect(result.current.files[0].status).toBe('idle')
    expect(result.current.files[0].progress).toBe(0)
  })

  it('adds multiple files', () => {
    const { result } = renderHook(() => useFileUpload({ multiple: true }))
    act(() => {
      result.current.addFiles([
        makeFile('a.jpg', 'image/jpeg'),
        makeFile('b.png', 'image/png'),
      ])
    })
    expect(result.current.files).toHaveLength(2)
  })

  it('replaces files when multiple is false', () => {
    const { result } = renderHook(() => useFileUpload({ multiple: false }))
    act(() => {
      result.current.addFiles([makeFile('a.jpg', 'image/jpeg')])
    })
    act(() => {
      result.current.addFiles([makeFile('b.png', 'image/png')])
    })
    expect(result.current.files).toHaveLength(1)
    expect(result.current.files[0].file.name).toBe('b.png')
  })

  it('removes a file by id', () => {
    const { result } = renderHook(() => useFileUpload())
    act(() => {
      result.current.addFiles([makeFile('photo.jpg', 'image/jpeg')])
    })
    const id = result.current.files[0].id
    act(() => {
      result.current.removeFile(id)
    })
    expect(result.current.files).toHaveLength(0)
  })

  it('clears all files', () => {
    const { result } = renderHook(() => useFileUpload())
    act(() => {
      result.current.addFiles([
        makeFile('a.jpg', 'image/jpeg'),
        makeFile('b.png', 'image/png'),
      ])
    })
    act(() => {
      result.current.clearFiles()
    })
    expect(result.current.files).toHaveLength(0)
  })

  it('validates file types and rejects invalid ones', () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useFileUpload({
        validation: { accept: ['image/*'] },
        onError,
      })
    )
    act(() => {
      result.current.addFiles([makeFile('doc.pdf', 'application/pdf')])
    })
    expect(result.current.files).toHaveLength(0)
    expect(onError).toHaveBeenCalledOnce()
  })

  it('validates max file size', () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useFileUpload({
        validation: { maxSize: 500 },
        onError,
      })
    )
    act(() => {
      result.current.addFiles([makeFile('big.jpg', 'image/jpeg', 1000)])
    })
    expect(result.current.files).toHaveLength(0)
    expect(onError).toHaveBeenCalledOnce()
  })

  it('respects maxFiles limit', () => {
    const onError = vi.fn()
    const { result } = renderHook(() =>
      useFileUpload({
        validation: { maxFiles: 2 },
        onError,
      })
    )
    act(() => {
      result.current.addFiles([
        makeFile('a.jpg', 'image/jpeg'),
        makeFile('b.jpg', 'image/jpeg'),
        makeFile('c.jpg', 'image/jpeg'),
      ])
    })
    expect(result.current.files).toHaveLength(2)
    expect(onError).toHaveBeenCalled()
  })

  it('calls onFilesAdded when files are added', () => {
    const onFilesAdded = vi.fn()
    const { result } = renderHook(() => useFileUpload({ onFilesAdded }))
    act(() => {
      result.current.addFiles([makeFile('photo.jpg', 'image/jpeg')])
    })
    expect(onFilesAdded).toHaveBeenCalledOnce()
    expect(onFilesAdded.mock.calls[0][0]).toHaveLength(1)
  })

  it('calls onFileRemoved when a file is removed', () => {
    const onFileRemoved = vi.fn()
    const { result } = renderHook(() => useFileUpload({ onFileRemoved }))
    act(() => {
      result.current.addFiles([makeFile('photo.jpg', 'image/jpeg')])
    })
    const id = result.current.files[0].id
    act(() => {
      result.current.removeFile(id)
    })
    expect(onFileRemoved).toHaveBeenCalledWith(id)
  })

  it('uploads a file and sets status to success', async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useFileUpload({ onUpload }))
    act(() => {
      result.current.addFiles([makeFile('photo.jpg', 'image/jpeg')])
    })
    const id = result.current.files[0].id
    await act(async () => {
      await result.current.uploadFile(id)
    })
    expect(onUpload).toHaveBeenCalledOnce()
    expect(result.current.files[0].status).toBe('success')
    expect(result.current.files[0].progress).toBe(100)
  })

  it('sets status to error when upload fails', async () => {
    const onUpload = vi.fn().mockRejectedValue(new Error('Network error'))
    const onError = vi.fn()
    const { result } = renderHook(() => useFileUpload({ onUpload, onError }))
    act(() => {
      result.current.addFiles([makeFile('photo.jpg', 'image/jpeg')])
    })
    const id = result.current.files[0].id
    await act(async () => {
      await result.current.uploadFile(id)
    })
    expect(result.current.files[0].status).toBe('error')
    expect(result.current.files[0].error).toBe('Network error')
    expect(onError).toHaveBeenCalled()
  })

  it('uploads all idle files', async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useFileUpload({ onUpload }))
    act(() => {
      result.current.addFiles([
        makeFile('a.jpg', 'image/jpeg'),
        makeFile('b.png', 'image/png'),
      ])
    })
    await act(async () => {
      await result.current.uploadAll()
    })
    expect(onUpload).toHaveBeenCalledTimes(2)
    result.current.files.forEach((f) => {
      expect(f.status).toBe('success')
    })
  })

  it('getRootProps returns correct accessibility attributes', () => {
    const { result } = renderHook(() => useFileUpload())
    const rootProps = result.current.getRootProps()
    expect(rootProps.role).toBe('button')
    expect(rootProps.tabIndex).toBe(0)
    expect(rootProps['aria-label']).toBeDefined()
  })

  it('getInputProps returns hidden file input attributes', () => {
    const { result } = renderHook(() => useFileUpload())
    const inputProps = result.current.getInputProps()
    expect(inputProps.type).toBe('file')
    expect(inputProps.style?.display).toBe('none')
    expect(inputProps['aria-hidden']).toBe(true)
  })
})
