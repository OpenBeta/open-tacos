import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModalWrapper from '../ModalWrapper'

const mockBack = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({
    uuid: 'test-uuid-123'
  })),
  useRouter: jest.fn(() => ({
    back: mockBack
  }))
}))

describe('<ModalWrapper />', () => {
  beforeEach(() => {
    mockBack.mockClear()
  })

  it('renders image and sidebar containers', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image Content</div>}
        sidebarContainer={<div>Sidebar Content</div>}
      />
    )

    expect(screen.getByText('Image Content')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('renders backdrop and modal structure', () => {
    const { container } = render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const backdrop = container.querySelector('[class*=\'bg-base-900\']')
    const modal = container.querySelector('[class*=\'shadow-2xl\']')

    expect(backdrop).toBeInTheDocument()
    expect(modal).toBeInTheDocument()
  })

  it('has close button', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    expect(closeButton).toBeInTheDocument()
  })

  it('closes modal when X button clicked', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    fireEvent.click(closeButton)

    expect(mockBack).toHaveBeenCalled()
  })

  it('closes modal when backdrop clicked', () => {
    const { container } = render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const backdrop = container.querySelector('[class*="bg-base-900"]') as HTMLElement
    fireEvent.click(backdrop)

    expect(mockBack).toHaveBeenCalled()
  })

  it('does not close modal when sidebar clicked', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div data-testid='sidebar-content'>Sidebar</div>}
      />
    )

    const content = screen.getByTestId('sidebar-content')
    fireEvent.click(content)

    expect(mockBack).not.toHaveBeenCalled()
  })

  it('defaults to area type when not specified', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    fireEvent.click(closeButton)

    expect(mockBack).toHaveBeenCalled()
  })
})
