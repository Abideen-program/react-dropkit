import React from 'react'
import type { DropzoneProps } from '../../types'
import { FileList } from '../FileList'
import { useFileUpload } from '../../hooks/useFileUpload'

const UploadIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
)

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesAdded,
  onFileRemoved,
  onFilesChange,
  onUpload,
  onError,
  validation = {},
  multiple = true,
  disabled = false,
  className = '',
  children,
}) => {
  const { files, isDragActive, isDragReject, getRootProps, getInputProps, removeFile, inputRef } =
    useFileUpload({
      validation,
      multiple,
      onUpload,
      onFilesAdded,
      onFileRemoved,
      onFilesChange,
      onError,
    })

  const inputProps = getInputProps()

  const borderColor = disabled
    ? '#d1d5db'
    : isDragReject
    ? '#ef4444'
    : isDragActive
    ? '#3b82f6'
    : '#d1d5db'

  const backgroundColor = disabled
    ? '#f9fafb'
    : isDragReject
    ? '#fff5f5'
    : isDragActive
    ? '#eff6ff'
    : '#fafafa'

  const rootProps = getRootProps()

  return (
    <div className={`rdk-dropzone-wrapper ${className}`}>
      {/* Drop zone area */}
      <div
        {...rootProps}
        onClick={disabled ? undefined : rootProps.onClick}
        aria-disabled={disabled}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: '12px',
          backgroundColor,
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          outline: 'none',
          userSelect: 'none',
        }}
        onFocus={(e) => {
          if (!disabled) {
            ;(e.currentTarget as HTMLDivElement).style.boxShadow =
              '0 0 0 3px rgba(59,130,246,0.3)'
          }
        }}
        onBlur={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        }}
      >
        {/* Hidden file input */}
        <input
          type={inputProps.type}
          multiple={inputProps.multiple}
          accept={inputProps.accept}
          onChange={inputProps.onChange}
          style={inputProps.style}
          aria-hidden={inputProps['aria-hidden']}
          tabIndex={inputProps.tabIndex}
          ref={inputRef}
        />

        {children ?? (
          <>
            <div
              style={{
                color: isDragReject ? '#ef4444' : isDragActive ? '#3b82f6' : '#9ca3af',
                transition: 'color 0.2s ease',
              }}
            >
              <UploadIcon />
            </div>

            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDragReject ? '#ef4444' : '#374151',
                }}
              >
                {isDragReject
                  ? 'Some files are not accepted'
                  : isDragActive
                  ? 'Drop files here'
                  : 'Drag & drop files here'}
              </p>
              {!isDragActive && (
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                  or{' '}
                  <span
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'underline',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    browse files
                  </span>
                </p>
              )}
            </div>

            {/* Validation hints */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {validation.accept && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {validation.accept.join(', ')}
                </span>
              )}
              {validation.maxSize && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  Max {Math.round(validation.maxSize / (1024 * 1024))}MB
                </span>
              )}
              {validation.maxFiles && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  Up to {validation.maxFiles} file{validation.maxFiles === 1 ? '' : 's'}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* File list below dropzone */}
      <FileList files={files} onRemove={removeFile} />
    </div>
  )
}

Dropzone.displayName = 'Dropzone'
