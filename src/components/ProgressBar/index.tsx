import React from 'react'
import type { ProgressBarProps } from '../../types'

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  const barColor =
    status === 'success'
      ? '#22c55e'
      : status === 'error'
      ? '#ef4444'
      : '#3b82f6'

  return (
    <div
      className={`rdk-progress ${className}`}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Upload progress: ${clampedProgress}%`}
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#e5e7eb',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${clampedProgress}%`,
          backgroundColor: barColor,
          borderRadius: '9999px',
          transition: 'width 0.3s ease, background-color 0.2s ease',
        }}
      />
    </div>
  )
}

ProgressBar.displayName = 'ProgressBar'
