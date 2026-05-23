/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Generates a unique ID for each file
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Checks if a file matches the accepted types
 * Handles MIME types (image/*), exact MIME types (image/png), and extensions (.pdf)
 * Works correctly across Windows, Mac, and Safari
 */
export function isFileAccepted(file: File, accept: string[]): boolean {
  if (!accept || accept.length === 0) return true

  return accept.some((type) => {
    const trimmed = type.trim()

    // Extension match e.g. ".pdf", ".docx"
    if (trimmed.startsWith('.')) {
      return file.name.toLowerCase().endsWith(trimmed.toLowerCase())
    }

    // Wildcard MIME match e.g. "image/*"
    if (trimmed.endsWith('/*')) {
      const baseType = trimmed.replace('/*', '')
      return file.type.startsWith(baseType)
    }

    // Exact MIME match e.g. "image/png"
    return file.type === trimmed
  })
}

/**
 * Checks if a file passes all size validations
 */
export function isFileSizeValid(
  file: File,
  maxSize?: number,
  minSize?: number
): { valid: boolean; error?: string } {
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Max size is ${formatFileSize(maxSize)}`,
    }
  }
  if (minSize && file.size < minSize) {
    return {
      valid: false,
      error: `File is too small. Min size is ${formatFileSize(minSize)}`,
    }
  }
  return { valid: true }
}

/**
 * Returns true if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Creates an object URL preview for image files
 */
export function createPreview(file: File): string | undefined {
  if (isImageFile(file)) {
    return URL.createObjectURL(file)
  }
  return undefined
}

/**
 * Revokes object URL to prevent memory leaks
 */
export function revokePreview(preview?: string): void {
  if (preview && preview.startsWith('blob:')) {
    URL.revokeObjectURL(preview)
  }
}

/**
 * Gets the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toUpperCase()
}
