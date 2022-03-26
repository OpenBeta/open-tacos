import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen } from '@testing-library/react'
import LeanPopover from '../LeanPopver'

test('LeanPopover responds to clicks', () => {
  const handleClick = jest.fn()

  render(
    <LeanPopover
      btnLabel='Foo'
      btnClz='my-btn-clz'
    >
      <LeanPopover.ContentPanel
        className='my-panel-clz'
        btnApplyLabel='Ok'
        onApply={handleClick}
      >
        <header>my header</header>
        <div>my content</div>
      </LeanPopover.ContentPanel>
    </LeanPopover>)

  expect(screen.queryByRole('banner')).toBeNull()

  fireEvent.click(screen.getByText(/Foo/i))

  expect(screen.queryByRole('banner')).toHaveTextContent('my header')

  fireEvent.click(screen.getByText(/Ok/i))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
