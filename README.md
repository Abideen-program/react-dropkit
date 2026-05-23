# react-dropkit

A modern, accessible, TypeScript-first React file upload library.  
Drag-and-drop, image previews, progress tracking — with zero backend opinions.

[![npm version](https://img.shields.io/npm/v/react-dropkit.svg)](https://www.npmjs.com/package/react-dropkit)
[![npm downloads](https://img.shields.io/npm/dm/react-dropkit.svg)](https://www.npmjs.com/package/react-dropkit)
[![CI](https://github.com/Abideen-program/react-dropkit/actions/workflows/ci.yml/badge.svg)](https://github.com/Abideen-program/react-dropkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

# react-dropkit

A modern, accessible, TypeScript-first React file upload library.

[![npm version](https://img.shields.io/npm/v/react-dropkit.svg)](https://www.npmjs.com/package/react-dropkit)
...

📖 **[Documentation](https://abideen-program.github.io/react-dropkit/)** — full API reference, examples, and quick start guide.

---

## Why react-dropkit?

- **TypeScript-first** — full types out of the box, no `@types/` package needed
- **Accessible by default** — ARIA roles, keyboard navigation, screen reader support
- **ESM + CJS** — works with Next.js, Vite, Remix, and any modern bundler
- **Zero backend opinions** — plug in your own upload logic (S3, Cloudinary, custom API)
- **Image previews built-in** — thumbnails for images, file icons for everything else
- **Per-file progress tracking** — update progress from your own upload handler
- **Headless or styled** — use the ready-made UI or bring your own with `useFileUpload`
- **Tiny bundle** — no bloat, no dependencies beyond React

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

### With file type and size validation

```tsx
<Dropzone
  validation={{
    accept: ['image/*', '.pdf'],   // accept images and PDFs
    maxSize: 10 * 1024 * 1024,     // 10MB max
    minSize: 1024,                 // 1KB min
    maxFiles: 5,                   // max 5 files
  }}
  multiple={true}
/>
```

### With upload handler

Connect any upload backend — S3, Cloudinary, your own API:

```tsx
<Dropzone
  onUpload={async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
  }}
  onFilesAdded={(files) => console.log('Files ready:', files)}
/>
```

### Single file upload

```tsx
<Dropzone multiple={false} />
```

### Custom drop zone UI

Pass children to fully replace the default UI while keeping all the logic:

```tsx
<Dropzone>
  <div style={{ padding: 40, textAlign: 'center' }}>
    <p>📂 Drop your files here</p>
  </div>
</Dropzone>
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
      {/* Drop zone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragReject ? 'red' : isDragActive ? 'blue' : 'gray'}`,
          padding: 32,
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <p>{isDragActive ? 'Drop here!' : 'Drag files or click to browse'}</p>
      </div>

      {/* File list */}
      <FileList files={files} onRemove={removeFile} />

      {/* Actions */}
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

## Individual Components

### `<Dropzone />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `validation` | `ValidationOptions` | `{}` | File validation rules |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `disabled` | `boolean` | `false` | Disable the drop zone |
| `onFilesAdded` | `(files: UploadedFile[]) => void` | — | Called when files pass validation |
| `onUpload` | `(file: UploadedFile) => Promise<void>` | — | Upload handler per file |
| `className` | `string` | `''` | Custom class for the wrapper |
| `children` | `ReactNode` | — | Override default drop zone UI |

### `<FileList />`

| Prop | Type | Description |
|---|---|---|
| `files` | `UploadedFile[]` | Array of files to display |
| `onRemove` | `(id: string) => void` | Called when remove is clicked |
| `className` | `string` | Custom class |

### `<FilePreview />`

| Prop | Type | Description |
|---|---|---|
| `file` | `UploadedFile` | Single file to display |
| `onRemove` | `(id: string) => void` | Called when remove is clicked |
| `className` | `string` | Custom class |

### `<ProgressBar />`

| Prop | Type | Description |
|---|---|---|
| `progress` | `number` | 0–100 |
| `status` | `FileStatus` | `idle`, `uploading`, `success`, `error` |
| `className` | `string` | Custom class |

---

## Validation Options

```ts
interface ValidationOptions {
  accept?: string[]    // ['image/*', '.pdf', 'video/mp4']
  maxSize?: number     // in bytes — e.g. 5 * 1024 * 1024 for 5MB
  minSize?: number     // in bytes
  maxFiles?: number    // max number of files allowed total
}
```

**Accept format supports:**
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

All utils are exported for building custom UIs:

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

react-dropkit ships both ESM and CJS builds and is fully compatible with Next.js App Router and Pages Router.

For App Router, mark your component as a client component:

```tsx
'use client'

import { Dropzone } from 'react-dropkit'
```

The library's bundle output already includes `"use client"` directives, so it won't accidentally run on the server.

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
git clone https://github.com/YOUR_USERNAME/react-dropkit
cd react-dropkit
npm install
npm test
npm run dev
```

---

## License

MIT © [Abideen Olafimihan] · [Documentation](https://abideen-program.github.io/react-dropkit/) · [npm](https://npmjs.com/package/react-dropkit) · [GitHub](https://github.com/abideen-program/react-dropkit)
