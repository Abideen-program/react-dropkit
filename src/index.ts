// Components
export { Dropzone } from './components/Dropzone'
export { FileList } from './components/FileList'
export { FilePreview } from './components/FilePreview'
export { ProgressBar } from './components/ProgressBar'

// Hooks
export { useFileUpload } from './hooks/useFileUpload'
export { useFileValidation } from './hooks/useFileValidation'

// Utils (useful for consumers building custom UIs)
export {
  formatFileSize,
  generateId,
  isFileAccepted,
  isFileSizeValid,
  isImageFile,
  createPreview,
  revokePreview,
  getFileExtension,
} from './utils'

// Types
export type {
  FileStatus,
  UploadedFile,
  ValidationOptions,
  DropzoneProps,
  FileListProps,
  FilePreviewProps,
  ProgressBarProps,
  UseFileUploadOptions,
  UseFileUploadReturn,
} from './types'
