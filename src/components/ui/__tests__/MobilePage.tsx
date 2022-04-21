import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'

import MobileFilterPopover from '../MobileFilterPopover'

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  })
  window.IntersectionObserver = mockIntersectionObserver
})

test('MobileFilterPopover', () => {
  const handleClick = jest.fn()

  render(
    <MobileFilterPopover
      mobileLabel='mobile label'
      btnLabel='click me'
      title='my title 1'
      onApply={handleClick}
    >
      <div>hello</div>
    </MobileFilterPopover>
  )

  expect(screen.queryByText(/my title 1/i)).toBeNull()

  fireEvent.click(screen.getByText(/click me/i))
  expect(screen.getByText(/my title 1/i)).toBeInTheDocument()
  expect(screen.getByText(/hello/i)).toBeInTheDocument()

  fireEvent.click(screen.getByText(/Home/i))
  expect(handleClick).toBeCalledTimes(1)
})
