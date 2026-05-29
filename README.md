# react-dropkit

A modern, accessible, TypeScript-first React file upload library.  
Drag-and-drop, image previews, progress tracking — with zero backend opinions.

[![npm version](https://img.shields.io/npm/v/react-dropkit.svg)](https://www.npmjs.com/package/react-dropkit)
[![npm downloads](https://img.shields.io/npm/dm/react-dropkit.svg)](https://www.npmjs.com/package/react-dropkit)
[![CI](https://github.com/abideen-program/react-dropkit/actions/workflows/ci.yml/badge.svg)](https://github.com/abideen-program/react-dropkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

📖 **[Documentation](https://abideen-program.github.io/react-dropkit/)** · ✦ **[Live Demo](https://abideen-program.github.io/react-dropkit/demo.html)**

---

## Why react-dropkit?

- **TypeScript-first** — full types out of the box, no `@types/` package needed
- **Accessible by default** — ARIA roles, keyboard navigation, screen reader support
- **ESM + CJS** — works with Next.js, Vite, Remix, and any modern bundler
- **Zero backend opinions** — plug in your own upload logic (S3, Cloudinary, custom API)
- **Image previews built-in** — thumbnails for images, file icons for everything else
- **Per-file progress tracking** — animated progress bar per file with status updates
- **Headless or styled** — use the ready-made UI or bring your own with `useFileUpload`
- **Manual or auto upload** — choose whether files upload immediately or wait for a button click
- **Fully customisable** — style any part of the component with className props
- **Tiny bundle** — zero dependencies beyond React

---

## Installation

```bash
npm install react-dropkit
# or
yarn add react-dropkit
# or
pnpm add react-dropkit
```

**Peer dependencies:** `react >= 17`, `react-dom >= 17`

---

## Quick Start

```tsx
import { Dropzone } from 'react-dropkit'

export default function App() {
  return (
    <Dropzone
      validation={{ accept: ['image/*'], maxSize: 5 * 1024 * 1024 }}
      onFilesAdded={(files) => console.log('Added:', files)}
    />
  )
}
```

---

## Usage Examples

### Basic drop zone

```tsx
import { Dropzone } from 'react-dropkit'

<Dropzone />
```

### With validation

```tsx
<Dropzone
  validation={{
    accept: ['image/*', '.pdf'],   // images and PDFs only
    maxSize: 10 * 1024 * 1024,     // 10MB max
    minSize: 1024,                 // 1KB min
    maxFiles: 5,                   // max 5 files
  }}
  multiple={true}
/>
```

### With upload handler (auto upload)

Files upload automatically the moment they are added:

```tsx
<Dropzone
  onUpload={async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    await fetch('/api/upload', { method: 'POST', body: formData })
  }}
/>
```

### Manual upload with buttons

Files sit in idle state until the user clicks Upload:

```tsx
<Dropzone
  autoUpload={false}
  showUploadButton
  showClearButton
  uploadButtonLabel="Send files"
  clearButtonLabel="Remove all"
  onUpload={async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    await fetch('/api/upload', { method: 'POST', body: formData })
  }}
/>
```

### Custom styling

Style the inner drop zone and file list independently:

```tsx
<Dropzone
  className="my-wrapper"
  dropzoneClassName="my-drop-area"
  fileListClassName="my-file-list"
/>
```

### Single file upload

```tsx
<Dropzone multiple={false} />
```

### Custom drop zone UI

Pass children to replace the default UI while keeping all the logic:

```tsx
<Dropzone>
  <div style={{ padding: 40, textAlign: 'center' }}>
    <p>📂 Drop your files here</p>
  </div>
</Dropzone>
```

### Use in a form

```tsx
import { useState } from 'react'
import { useFileUpload } from 'react-dropkit'

export function ProfileForm() {
  const [name, setName] = useState('')
  const { files, getRootProps, getInputProps, inputRef } = useFileUpload({
    multiple: false,
    validation: { accept: ['image/*'] },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    if (files[0]) formData.append('avatar', files[0].file)
    await fetch('/api/profile', { method: 'POST', body: formData })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <div {...getRootProps()}>
        <input {...getInputProps()} ref={inputRef} />
        <p>Drop avatar here</p>
      </div>
      <button type="submit">Save</button>
    </form>
  )
}
```

---

## Headless Usage — `useFileUpload`

For full control over the UI, use the hook directly:

```tsx
import { useFileUpload, FileList } from 'react-dropkit'

export function MyUploader() {
  const {
    files,
    isDragActive,
    isDragReject,
    getRootProps,
    getInputProps,
    inputRef,
    removeFile,
    uploadAll,
    clearFiles,
  } = useFileUpload({
    multiple: true,
    validation: {
      accept: ['image/*'],
      maxSize: 5 * 1024 * 1024,
    },
    onUpload: async (file) => {
      // your upload logic
    },
    onError: (message) => {
      console.error(message)
    },
  })

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragReject ? 'red' : isDragActive ? 'blue' : 'gray'}`,
          padding: 32,
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} ref={inputRef} />
        <p>{isDragActive ? 'Drop here!' : 'Drag files or click to browse'}</p>
      </div>

      <FileList files={files} onRemove={removeFile} />

      {files.length > 0 && (
        <div>
          <button onClick={uploadAll}>Upload All</button>
          <button onClick={clearFiles}>Clear</button>
        </div>
      )}
    </div>
  )
}
```

---

## API Reference

### `<Dropzone />` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `validation` | `ValidationOptions` | `{}` | File type, size, and count rules |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `disabled` | `boolean` | `false` | Disable the drop zone |
| `autoUpload` | `boolean` | `true` | Upload files immediately on add. Set to `false` for manual upload |
| `showUploadButton` | `boolean` | `false` | Show a built-in Upload All button |
| `showClearButton` | `boolean` | `false` | Show a built-in Clear All button |
| `uploadButtonLabel` | `string` | `"Upload All"` | Custom label for the upload button |
| `clearButtonLabel` | `string` | `"Clear All"` | Custom label for the clear button |
| `onFilesAdded` | `(files: UploadedFile[]) => void` | — | Called when new files pass validation |
| `onFilesChange` | `(files: UploadedFile[]) => void` | — | Called on every change — add, remove, clear |
| `onFileRemoved` | `(id: string) => void` | — | Called when a file is removed |
| `onUpload` | `(file: UploadedFile) => Promise<void>` | — | Your upload handler per file |
| `onError` | `(error: string) => void` | — | Called on validation failure or upload error |
| `className` | `string` | `""` | Class on the outer wrapper |
| `dropzoneClassName` | `string` | `""` | Class on the inner drop zone area |
| `fileListClassName` | `string` | `""` | Class on the file list |
| `children` | `ReactNode` | — | Override the default drop zone UI |

### `<FileList />` Props

| Prop | Type | Description |
|---|---|---|
| `files` | `UploadedFile[]` | Array of files to display |
| `onRemove` | `(id: string) => void` | Called when remove is clicked |
| `className` | `string` | Custom class |

### `<FilePreview />` Props

| Prop | Type | Description |
|---|---|---|
| `file` | `UploadedFile` | Single file to display |
| `onRemove` | `(id: string) => void` | Called when remove is clicked |
| `className` | `string` | Custom class |

### `<ProgressBar />` Props

| Prop | Type | Description |
|---|---|---|
| `progress` | `number` | 0–100 |
| `status` | `FileStatus` | `idle`, `uploading`, `success`, `error` |
| `className` | `string` | Custom class |

### `useFileUpload()` Options

| Option | Type | Default | Description |
|---|---|---|---|
| `validation` | `ValidationOptions` | `{}` | File validation rules |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `autoUpload` | `boolean` | `true` | Auto upload on file add |
| `onUpload` | `(file: UploadedFile) => Promise<void>` | — | Upload handler |
| `onFilesAdded` | `(files: UploadedFile[]) => void` | — | Called when files are added |
| `onFilesChange` | `(files: UploadedFile[]) => void` | — | Called on every state change |
| `onFileRemoved` | `(id: string) => void` | — | Called when a file is removed |
| `onError` | `(error: string) => void` | — | Called on error |

### `useFileUpload()` Returns

| Value | Type | Description |
|---|---|---|
| `files` | `UploadedFile[]` | Current files with status, progress, preview |
| `isDragActive` | `boolean` | True when dragging over the drop zone |
| `isDragReject` | `boolean` | True when dragged files don't match accepted types |
| `getRootProps()` | `HTMLAttributes` | Spread onto your drop zone container |
| `getInputProps()` | `InputHTMLAttributes` | Spread onto a hidden input element |
| `inputRef` | `RefObject<HTMLInputElement>` | Attach to input so clicking opens file browser |
| `addFiles(files)` | `(File[]) => void` | Programmatically add files |
| `removeFile(id)` | `(string) => void` | Remove a file by ID |
| `clearFiles()` | `() => void` | Remove all files |
| `uploadFile(id)` | `(string) => Promise<void>` | Upload a single file by ID |
| `uploadAll()` | `() => Promise<void>` | Upload all idle or failed files |
| `openFileDialog()` | `() => void` | Programmatically open the file browser |

---

## Validation Options

```ts
interface ValidationOptions {
  accept?: string[]    // ['image/*', '.pdf', 'video/mp4']
  maxSize?: number     // bytes — e.g. 5 * 1024 * 1024 for 5MB
  minSize?: number     // bytes
  maxFiles?: number    // max total files allowed
}
```

Accept supports:
- Wildcard MIME types: `image/*`, `video/*`
- Exact MIME types: `image/png`, `application/pdf`
- File extensions: `.pdf`, `.docx`, `.csv`

---

## Types

```ts
type FileStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UploadedFile {
  id: string
  file: File
  preview?: string     // blob URL for images, undefined for others
  progress: number     // 0–100
  status: FileStatus
  error?: string
}
```

---

## Utility Functions

```ts
import {
  formatFileSize,      // formatFileSize(1024) → "1 KB"
  isFileAccepted,      // checks MIME type or extension
  isFileSizeValid,     // checks against max/min size
  isImageFile,         // true if file.type starts with "image/"
  getFileExtension,    // getFileExtension("doc.pdf") → "PDF"
  createPreview,       // creates blob URL for images
  revokePreview,       // cleans up blob URLs
} from 'react-dropkit'
```

---

## Next.js Support

react-dropkit is fully compatible with Next.js App Router and Pages Router.

For App Router, mark your component as a client component:

```tsx
'use client'

import { Dropzone } from 'react-dropkit'
```

---

## Changelog

### v0.2.0
- Added `autoUpload` prop — toggle between auto and manual upload mode
- Added `showUploadButton` and `showClearButton` props — built-in action buttons on `<Dropzone />`
- Added `uploadButtonLabel` and `clearButtonLabel` — custom button text
- Added `dropzoneClassName` — style the inner drop zone area independently
- Added `fileListClassName` — style the file list independently

### v0.1.0
- Initial release

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
git clone https://github.com/abideen-program/react-dropkit
cd react-dropkit
npm install
npm test
npm run dev
```

---

## License

MIT © Abideen · [Documentation](https://abideen-program.github.io/react-dropkit/) · [npm](https://npmjs.com/package/react-dropkit) · [GitHub](https://github.com/abideen-program/react-dropkit)
