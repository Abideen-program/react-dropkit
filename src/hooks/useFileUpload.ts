import { useCallback, useEffect, useRef, useState } from 'react'
import type { UploadedFile, UseFileUploadOptions, UseFileUploadReturn } from '../types'
import { createPreview, generateId, revokePreview } from '../utils'
import { useFileValidation } from './useFileValidation'

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    validation = {},
    multiple = true,
    onUpload,
    onFilesAdded,
    onFileRemoved,
    onFilesChange,
    onError,
  } = options

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [isDragReject, setIsDragReject] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragCounterRef = useRef(0)

  const { validateFiles, isDragEventAccepted } = useFileValidation(validation)

  // Always-current ref to files — avoids stale closures in callbacks
  const filesRef = useRef<UploadedFile[]>([])
  filesRef.current = files

  // Always-current ref to onFilesChange — avoids stale closures
  const onFilesChangeRef = useRef(onFilesChange)
  onFilesChangeRef.current = onFilesChange



  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => revokePreview(f.preview))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const { valid, errors } = validateFiles(newFiles, files.length)

      errors.forEach((err) => onError?.(err))

      if (valid.length === 0) return

      const uploadedFiles: UploadedFile[] = valid.map((file) => ({
        id: generateId(),
        file,
        preview: createPreview(file),
        progress: 0,
        status: 'idle',
      }))

      const next = multiple ? [...filesRef.current, ...uploadedFiles] : uploadedFiles
      setFiles(next)
      onFilesChangeRef.current?.(next)
      onFilesAdded?.(uploadedFiles)
    },
    [files.length, multiple, validateFiles, onError, onFilesAdded]
  )

  const removeFile = useCallback(
    (id: string) => {
      const fileToRemove = filesRef.current.find((f) => f.id === id)
      if (fileToRemove) revokePreview(fileToRemove.preview)
      const next = filesRef.current.filter((f) => f.id !== id)
      setFiles(next)
      onFilesChangeRef.current?.(next)
      onFileRemoved?.(id)
    },
    [onFileRemoved]
  )

  const clearFiles = useCallback(() => {
    filesRef.current.forEach((f) => revokePreview(f.preview))
    setFiles([])
    onFilesChangeRef.current?.([])
  }, [])

  const uploadFile = useCallback(
    async (id: string) => {
      if (!onUpload) return

      const file = files.find((f) => f.id === id)
      if (!file || file.status === 'uploading') return

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: 'uploading', progress: 0, error: undefined } : f
        )
      )

      try {
        await onUpload({
          ...file,
          status: 'uploading',
        })
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: 'success', progress: 100 } : f
          )
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Upload failed'
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, status: 'error', progress: 0, error: errorMessage }
              : f
          )
        )
        onError?.(errorMessage, file)
      }
    },
    [files, onUpload, onError]
  )

  const uploadAll = useCallback(async () => {
    const pending = files.filter((f) => f.status === 'idle' || f.status === 'error')
    await Promise.all(pending.map((f) => uploadFile(f.id)))
  }, [files, uploadFile])

  // Expose a way to update progress from outside (via onUpload callback)
  const updateProgress = useCallback((id: string, progress: number) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, progress } : f))
    )
  }, [])

  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])

  // --- Drag and Drop handlers ---

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current++
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragActive(true)
        setIsDragReject(!isDragEventAccepted(e))
      }
    },
    [isDragEventAccepted]
  )

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragActive(false)
      setIsDragReject(false)
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setIsDragActive(false)
      setIsDragReject(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        addFiles(multiple ? droppedFiles : [droppedFiles[0]])
      }
    },
    [addFiles, multiple]
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      if (selectedFiles.length > 0) {
        addFiles(selectedFiles)
      }
      // Reset input so the same file can be re-added after removal
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [addFiles]
  )

  const getRootProps = useCallback(
    (): React.HTMLAttributes<HTMLElement> => ({
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onClick: openFileDialog,
      role: 'button',
      tabIndex: 0,
      'aria-label': 'File upload drop zone',
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openFileDialog()
        }
      },
    }),
    [onDragEnter, onDragLeave, onDragOver, onDrop, openFileDialog]
  )

  const getInputProps = useCallback(
    (): React.InputHTMLAttributes<HTMLInputElement> => ({
      type: 'file',
      multiple,
      accept: validation.accept?.join(','),
      onChange: onInputChange,
      style: { display: 'none' },
      'aria-hidden': true,
      tabIndex: -1,
    }),
    [multiple, validation.accept, onInputChange]
  )

  return {
    files,
    isDragActive,
    isDragReject,
    addFiles,
    removeFile,
    clearFiles,
    uploadFile,
    uploadAll,
    getRootProps,
    getInputProps,
    openFileDialog,
    inputRef,
    // Internal: exposed for advanced use cases
    _updateProgress: updateProgress,
  } as UseFileUploadReturn & { _updateProgress: (id: string, progress: number) => void }
}
