import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModalWrapper from '../ModalWrapper'

const mockBack = jest.fn()
const mockReplace = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({
    uuid: 'test-uuid-123'
  })),
  useRouter: jest.fn(() => ({
    back: mockBack,
    replace: mockReplace
  }))
}))

// Mock react-hotkeys-hook
jest.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn()
}))

// Mock useResponsive - default to desktop
jest.mock('../../../../../js/hooks/useResponsive', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  }))
}))

// Mock useBodyScrollLock
jest.mock('../../../../../js/hooks/useBodyScrollLock', () => ({
  useBodyScrollLock: jest.fn()
}))

describe('<ModalWrapper />', () => {
  beforeEach(() => {
    mockBack.mockClear()
    mockReplace.mockClear()
  })

  it('renders image and sidebar containers', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image Content</div>}
        sidebarContainer={<div>Sidebar Content</div>}
      />
    )

    // Should render once based on screen size
    expect(screen.getByText('Image Content')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('renders backdrop', () => {
    const { container } = render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const backdrop = container.querySelector('[class*=\'bg-base-900\']')
    expect(backdrop).toBeInTheDocument()
  })

  it('has close button', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const closeButton = screen.getByLabelText('Close modal')
    expect(closeButton).toBeInTheDocument()
  })

  it('closes modal when close button clicked', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    const closeButton = screen.getByLabelText('Close modal')
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

  it('shows sidebar in desktop view', () => {
    render(
      <ModalWrapper
        imageContainer={<div>Image</div>}
        sidebarContainer={<div>Sidebar</div>}
      />
    )

    // Desktop view should show sidebar directly, not info button
    const sidebar = screen.getByText('Sidebar')
    expect(sidebar).toBeInTheDocument()
  })
})
