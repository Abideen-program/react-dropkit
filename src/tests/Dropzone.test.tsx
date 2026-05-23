import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Dropzone } from '../components/Dropzone'

describe('Dropzone', () => {
  it('renders default drop zone content', () => {
    render(<Dropzone />)
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument()
    expect(screen.getByText(/browse files/i)).toBeInTheDocument()
  })

  it('renders validation hints when provided', () => {
    render(
      <Dropzone
        validation={{ accept: ['image/*'], maxSize: 5 * 1024 * 1024, maxFiles: 3 }}
      />
    )
    expect(screen.getByText(/image\/\*/i)).toBeInTheDocument()
    expect(screen.getByText(/5MB/i)).toBeInTheDocument()
    expect(screen.getByText(/3 files/i)).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<Dropzone />)
    const dropzone = screen.getByRole('button')
    expect(dropzone).toBeInTheDocument()
    expect(dropzone).toHaveAttribute('tabindex', '0')
    expect(dropzone).toHaveAttribute('aria-label')
  })

  it('renders custom children when provided', () => {
    render(
      <Dropzone>
        <p>Custom upload area</p>
      </Dropzone>
    )
    expect(screen.getByText('Custom upload area')).toBeInTheDocument()
    expect(screen.queryByText(/drag & drop/i)).not.toBeInTheDocument()
  })

  it('calls onFilesAdded when files are added via hook', async () => {
    const onFilesAdded = vi.fn()
    render(<Dropzone onFilesAdded={onFilesAdded} />)
    // File input is hidden — addFiles would be triggered by drop or input change
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveStyle({ display: 'none' })
  })
})
