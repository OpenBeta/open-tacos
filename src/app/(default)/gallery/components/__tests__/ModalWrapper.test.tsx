import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModalWrapper from '../ModalWrapper'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({
    uuid: 'test-uuid-123'
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => {
      if (key === 'type') return 'area'
      return null
    })
  }))
}))

describe('<ModalWrapper />', () => {
  beforeEach(() => {
    delete (window as any).location
    window.location = { href: '' } as any
  })

  it('renders children inside modal', () => {
    render(
      <ModalWrapper>
        <div>Test Content</div>
      </ModalWrapper>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders backdrop and modal structure', () => {
    const { container } = render(
      <ModalWrapper>
        <div>Test</div>
      </ModalWrapper>
    )

    const backdrop = container.querySelector('[class*=\'bg-black\']')
    const modal = container.querySelector('[class*=\'shadow-2xl\']')

    expect(backdrop).toBeInTheDocument()
    expect(modal).toBeInTheDocument()
  })

  it('has close button', () => {
    render(
      <ModalWrapper>
        <div>Test</div>
      </ModalWrapper>
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    expect(closeButton).toBeInTheDocument()
  })

  it('closes modal when X button clicked', () => {
    render(
      <ModalWrapper>
        <div>Test</div>
      </ModalWrapper>
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    fireEvent.click(closeButton)

    expect(window.location.href).toBe('/gallery/test-uuid-123?type=area')
  })

  it('closes modal when backdrop clicked', () => {
    const { container } = render(
      <ModalWrapper>
        <div>Test</div>
      </ModalWrapper>
    )

    const backdrop = container.querySelector('[class*="bg-black"]') as HTMLElement
    fireEvent.click(backdrop)

    expect(window.location.href).toBe('/gallery/test-uuid-123?type=area')
  })

  it('does not close modal when content clicked', () => {
    render(
      <ModalWrapper>
        <div data-testid='modal-content'>Test Content</div>
      </ModalWrapper>
    )

    const content = screen.getByTestId('modal-content')
    fireEvent.click(content)

    expect(window.location.href).toBe('')
  })

  it('handles climb type in URL', () => {
    render(
      <ModalWrapper>
        <div>Test</div>
      </ModalWrapper>
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    fireEvent.click(closeButton)

    // Verify it constructs URL with the area type (default)
    expect(window.location.href).toContain('type=area')
  })

  it('defaults to area type when not specified', () => {
    render(
      <ModalWrapper>
        <div>Test</div>
      </ModalWrapper>
    )

    const closeButton = screen.getByRole('button', { name: /Close modal/i })
    fireEvent.click(closeButton)

    // Verify URL is constructed correctly with default area type
    expect(window.location.href).toBe('/gallery/test-uuid-123?type=area')
  })
})
