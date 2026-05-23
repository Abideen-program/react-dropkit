import React from 'react'
import type { FileListProps } from '../../types'
import { FilePreview } from '../FilePreview'

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemove,
  className = '',
}) => {
  if (files.length === 0) return null

  return (
    <ul
      className={`rdk-file-list ${className}`}
      aria-label="Uploaded files"
      style={{
        listStyle: 'none',
        margin: '12px 0 0',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {files.map((file) => (
        <li key={file.id}>
          <FilePreview file={file} onRemove={onRemove} />
        </li>
      ))}
    </ul>
  )
}

FileList.displayName = 'FileList'
