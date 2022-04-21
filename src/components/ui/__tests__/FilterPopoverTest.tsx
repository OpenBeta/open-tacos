import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import FilterPopover from '../FilterPopover'

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

test('FilterPopever on mobile responds to clicks', () => {
  const onApplyFn = jest.fn()
  render(
    <FilterPopover
      label='btn label'
      mobileLabel='mobile label'
      header='header1'
      shortHeader='mobile short header'
      onApply={onApplyFn}
      isMobile
    >
      <div role='content'>my content</div>
    </FilterPopover>)

  expect(screen.queryByRole('content')).toBeNull()

  fireEvent.click(screen.getByText(/btn label/i))

  expect(screen.queryByRole('content')).toHaveTextContent('my content')
  expect(screen.queryByRole('button', { name: /Apply/i })).toBeNull() // Apply button only exists on desktop

  // click back button (aka Home)
  fireEvent.click(screen.getByRole('button', { name: /Home/i }))

  expect(onApplyFn).toBeCalledTimes(1)

  expect(screen.queryByRole('content')).toBeNull()
})

test('FilterPopever on desktop responds to clicks', () => {
  const onApplyFn = jest.fn()
  render(
    <FilterPopover
      label='btn label'
      mobileLabel='mobile label'
      header='header1'
      shortHeader='mobile short header'
      onApply={onApplyFn}
      isMobile={false}
    >
      <div role='content'>my content</div>
    </FilterPopover>)

  expect(screen.queryByRole('content')).toBeNull()

  fireEvent.click(screen.getByText(/btn label/i))

  expect(screen.queryByRole('content')).toHaveTextContent('my content')
  expect(screen.queryByRole('button', { name: /Home/i })).toBeNull() // Home button only exists on mobile

  fireEvent.click(screen.getByRole('button', { name: /Apply/i }))

  expect(onApplyFn).toBeCalledTimes(1)

  expect(screen.queryByRole('content')).toBeNull()
})
