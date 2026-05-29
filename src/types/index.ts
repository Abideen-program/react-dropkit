export type FileStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: FileStatus
  error?: string
}

export interface ValidationOptions {
  maxSize?: number           // bytes, e.g. 5 * 1024 * 1024 = 5MB
  minSize?: number           // bytes
  accept?: string[]          // e.g. ['image/*', '.pdf']
  maxFiles?: number
}

export interface DropzoneProps {
  onFilesAdded?: (files: UploadedFile[]) => void
  onFileRemoved?: (id: string) => void
  onFilesChange?: (files: UploadedFile[]) => void
  onUpload?: (file: UploadedFile) => Promise<void>
  onError?: (error: string, file?: UploadedFile) => void
  validation?: ValidationOptions
  multiple?: boolean
  disabled?: boolean
  autoUpload?: boolean
  showUploadButton?: boolean
  showClearButton?: boolean
  uploadButtonLabel?: string
  clearButtonLabel?: string
  className?: string
  dropzoneClassName?: string
  fileListClassName?: string
  children?: React.ReactNode
}

export interface FileListProps {
  files: UploadedFile[]
  onRemove?: (id: string) => void
  className?: string
}

export interface FilePreviewProps {
  file: UploadedFile
  onRemove?: (id: string) => void
  className?: string
}

export interface ProgressBarProps {
  progress: number
  status: FileStatus
  className?: string
}

export interface UseFileUploadOptions {
  validation?: ValidationOptions
  multiple?: boolean
  autoUpload?: boolean
  onUpload?: (file: UploadedFile) => Promise<void>
  onFilesAdded?: (files: UploadedFile[]) => void
  onFileRemoved?: (id: string) => void
  onFilesChange?: (files: UploadedFile[]) => void
  onError?: (error: string, file?: UploadedFile) => void
}

export interface UseFileUploadReturn {
  files: UploadedFile[]
  isDragActive: boolean
  isDragReject: boolean
  addFiles: (newFiles: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  uploadFile: (id: string) => Promise<void>
  uploadAll: () => Promise<void>
  getRootProps: () => React.HTMLAttributes<HTMLElement>
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>
  openFileDialog: () => void
  inputRef: React.RefObject<HTMLInputElement>
}
