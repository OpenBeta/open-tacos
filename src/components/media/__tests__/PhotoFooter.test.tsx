import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PhotoFooter from '../PhotoFooter'
import { MediaWithTags, MediaFormat } from '@/js/types'

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

  it('renders climb tag as link to climb page', () => {
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

    const link = screen.getByRole('link', { name: /Test Climb/ })
    expect(link).toHaveAttribute('href', '/climb/climb-uuid-123')
  })

  it('renders area tag as link to area page', () => {
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

    const link = screen.getByRole('link', { name: /Test Area/ })
    expect(link).toHaveAttribute('href', expect.stringContaining('/area/area-uuid-456'))
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

  it('displays photographer link when username exists', () => {
    const mediaWithTags: MediaWithTags = {
      ...mockMedia,
      username: 'photographer-123'
    }

    const { container } = render(<PhotoFooter mediaWithTags={mediaWithTags} hover />)
    const photoLink = container.querySelector('a[href="/u/photographer-123"]')
    expect(photoLink).toBeInTheDocument()
  })
})
