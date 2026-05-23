import { useCallback } from 'react'
import type { ValidationOptions } from '../types'
import { isFileAccepted, isFileSizeValid } from '../utils'

interface ValidationResult {
  valid: boolean
  error?: string
}

export function useFileValidation(options: ValidationOptions = {}) {
  const { maxSize, minSize, accept, maxFiles } = options

  const validateFile = useCallback(
    (file: File): ValidationResult => {
      // Check MIME type / extension
      if (accept && accept.length > 0 && !isFileAccepted(file, accept)) {
        return {
          valid: false,
          error: `File type not accepted. Allowed: ${accept.join(', ')}`,
        }
      }

      // Check file size
      const sizeCheck = isFileSizeValid(file, maxSize, minSize)
      if (!sizeCheck.valid) {
        return { valid: false, error: sizeCheck.error }
      }

      return { valid: true }
    },
    [accept, maxSize, minSize]
  )

  const validateFiles = useCallback(
    (files: File[], currentCount: number): { valid: File[]; errors: string[] } => {
      const valid: File[] = []
      const errors: string[] = []

      for (const file of files) {
        const result = validateFile(file)
        if (result.valid) {
          valid.push(file)
        } else {
          errors.push(`${file.name}: ${result.error}`)
        }
      }

      // Check max files after filtering invalid
      if (maxFiles !== undefined) {
        const remaining = maxFiles - currentCount
        if (remaining <= 0) {
          return {
            valid: [],
            errors: [`Maximum of ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`],
          }
        }
        const trimmed = valid.slice(0, remaining)
        if (trimmed.length < valid.length) {
          errors.push(
            `Only ${remaining} more file${remaining === 1 ? '' : 's'} can be added`
          )
        }
        return { valid: trimmed, errors }
      }

      return { valid, errors }
    },
    [validateFile, maxFiles]
  )

  /**
   * Checks if a dragged event contains accepted file types
   * Used to determine isDragReject
   */
  const isDragEventAccepted = useCallback(
    (event: DragEvent | React.DragEvent): boolean => {
      if (!accept || accept.length === 0) return true
      const items = event.dataTransfer?.items
      if (!items) return true

      return Array.from(items).every((item) => {
        if (item.kind !== 'file') return false
        // item.type can be empty on some browsers (e.g. file extension drops)
        if (!item.type) return true
        return isFileAccepted({ type: item.type, name: '' } as File, accept)
      })
    },
    [accept]
  )

  return { validateFile, validateFiles, isDragEventAccepted }
}
