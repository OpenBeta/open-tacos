import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoFooter from '../PhotoFooter'
import { MediaWithTags, MediaFormat } from '@/js/types'

const mockPush = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush
  }))
}))

const mockMedia: MediaWithTags = {
  id: 'photo-1',
  username: 'testuser',
  mediaUrl: 'https://example.com/photo.jpg',
  width: 1920,
  height: 1080,
  format: MediaFormat.jpg,
  size: 1024000,
  uploadTime: new Date(),
  entityTags: []
}

describe('<PhotoFooter />', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders without crashing when no tags', () => {
    render(<PhotoFooter mediaWithTags={mockMedia} hover={false} />)
  })

  it('renders tag button when tags exist', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      entityTags: [
        {
          id: 'tag-1',
          targetId: 'climb-uuid',
          type: 0,
          ancestors: '',
          climbName: 'Test Climb',
          areaName: 'Test Area'
        }
      ]
    }

    render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const tagButton = screen.getByRole('button', { name: /Show 1 tags/i })
    expect(tagButton).toBeInTheDocument()
  })

  it('shows tags popup on button click', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      entityTags: [
        {
          id: 'tag-1',
          targetId: 'climb-uuid',
          type: 0,
          ancestors: '',
          climbName: 'Test Climb',
          areaName: 'Test Area'
        }
      ]
    }

    render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const tagButton = screen.getByRole('button', { name: /Show 1 tags/i })
    fireEvent.click(tagButton)

    const tagsHeading = screen.getByText('Tags:')
    expect(tagsHeading).toBeInTheDocument()
  })

  it('renders climb tag as button that navigates to climb page', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      entityTags: [
        {
          id: 'tag-1',
          targetId: 'climb-uuid-123',
          type: 0,
          ancestors: '',
          climbName: 'Test Climb',
          areaName: 'Test Area'
        }
      ]
    }

    render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const tagButton = screen.getByRole('button', { name: /Show 1 tags/i })
    fireEvent.click(tagButton)

    const tagLink = screen.getByRole('button', { name: /Test Climb/ })
    expect(tagLink).toBeInTheDocument()
    fireEvent.click(tagLink)
    expect(mockPush).toHaveBeenCalledWith('/climb/climb-uuid-123')
  })

  it('renders area tag as button that navigates to area page', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      entityTags: [
        {
          id: 'tag-1',
          targetId: 'area-uuid-456',
          type: 1,
          ancestors: '',
          areaName: 'Test Area'
        }
      ]
    }

    render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const tagButton = screen.getByRole('button', { name: /Show 1 tags/i })
    fireEvent.click(tagButton)

    const tagLink = screen.getByRole('button', { name: /Test Area/ })
    expect(tagLink).toBeInTheDocument()
    fireEvent.click(tagLink)
    expect(mockPush).toHaveBeenCalled()
    expect(mockPush.mock.calls[0][0]).toContain('/area/area-uuid-456')
  })

  it('renders unsupported tag type as plain text', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      entityTags: [
        {
          id: 'tag-1',
          targetId: 'unknown-uuid',
          type: 99,
          ancestors: '',
          areaName: 'Unknown Type',
          climbName: 'Unknown Type'
        }
      ]
    }

    render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const tagButton = screen.getByRole('button', { name: /Show 1 tags/i })
    fireEvent.click(tagButton)

    const textElement = screen.getByText('Unknown Type')
    expect(textElement.tagName).not.toBe('A')
  })

  it('displays photographer button when username exists', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      username: 'photographer-123'
    }

    render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const photoButton = screen.getByRole('button', { name: /View photographer-123's profile/ })
    expect(photoButton).toBeInTheDocument()
    fireEvent.click(photoButton)
    expect(mockPush).toHaveBeenCalledWith('/u/photographer-123')
  })
})
