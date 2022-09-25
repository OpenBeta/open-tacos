import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import ToastHelper from './ToastHelper'

test('Toast smoke test', async () => {
  const { rerender } = render(
    <ToastHelper message='hello' />)

  rerender(<ToastHelper message='hello' />)

  expect(screen.getByText('hello')).not.toBeNull()

  rerender(<ToastHelper message='hola' />)
  rerender(<ToastHelper message='hola' />)

  expect(screen.getByText('hola')).not.toBeNull()
  expect(screen.getByText('hello')).not.toBeNull()
})
