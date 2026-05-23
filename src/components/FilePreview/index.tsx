import React from 'react'
import type { FilePreviewProps } from '../../types'
import { ProgressBar } from '../ProgressBar'
import { formatFileSize, getFileExtension } from '../../utils'

const statusColors = {
  idle: '#6b7280',
  uploading: '#3b82f6',
  success: '#22c55e',
  error: '#ef4444',
}

const statusLabels = {
  idle: 'Ready',
  uploading: 'Uploading…',
  success: 'Uploaded',
  error: 'Failed',
}

const CloseIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M1 1l10 10M11 1L1 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

const FileIcon = ({ extension }: { extension: string }) => (
  <div
    aria-hidden="true"
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      gap: '4px',
    }}
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
    {extension && (
      <span
        style={{
          fontSize: '9px',
          fontWeight: 700,
          color: '#6b7280',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {extension}
      </span>
    )}
  </div>
)

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  className = '',
}) => {
  const { id, file: rawFile, preview, progress, status, error } = file
  const extension = getFileExtension(rawFile.name)
  const statusColor = statusColors[status]
  const statusLabel = statusLabels[status]

  return (
    <div
      className={`rdk-file-preview ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '8px',
        border: `1px solid ${status === 'error' ? '#fca5a5' : '#e5e7eb'}`,
        backgroundColor: status === 'error' ? '#fff5f5' : '#fff',
        position: 'relative',
      }}
    >
      {/* Thumbnail / File icon */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '6px',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1px solid #e5e7eb',
        }}
        aria-hidden="true"
      >
        {preview ? (
          <img
            src={preview}
            alt={rawFile.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <FileIcon extension={extension} />
        )}
      </div>

      {/* File info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          title={rawFile.name}
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 500,
            color: '#111827',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {rawFile.name}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '2px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
            {formatFileSize(rawFile.size)}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: statusColor,
              fontWeight: 500,
            }}
            aria-live="polite"
          >
            {error || statusLabel}
          </span>
        </div>

        {/* Progress bar — only visible during upload */}
        {(status === 'uploading' || status === 'success') && (
          <div style={{ marginTop: '6px' }}>
            <ProgressBar progress={progress} status={status} />
          </div>
        )}
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(id)
          }}
          aria-label={`Remove ${rawFile.name}`}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#e5e7eb',
            color: '#6b7280',
            cursor: 'pointer',
            padding: 0,
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e5e7eb'
          }}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

FilePreview.displayName = 'FilePreview'
