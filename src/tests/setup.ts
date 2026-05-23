import '@testing-library/jest-dom'

// Mock URL.createObjectURL and URL.revokeObjectURL
// These are not available in jsdom
global.URL.createObjectURL = vi.fn((file: File) => `blob:mock-url-${file.name}`)
global.URL.revokeObjectURL = vi.fn()

// Mock DataTransfer for drag-and-drop tests
class MockDataTransfer {
  files: File[] = []
  items: { kind: string; type: string }[] = []
  types: string[] = []
  dropEffect = 'none'
  effectAllowed = 'all'

  setData() {}
  getData() { return '' }
  clearData() {}
}

global.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer
