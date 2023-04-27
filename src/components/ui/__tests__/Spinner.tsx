import React from 'react'
import { render, screen } from '@testing-library/react'
import Spinner from '../Spinner'
import '@testing-library/jest-dom/extend-expect'

describe('Spinner component', () => {
  it('renders with default size and color', () => {
    render(<Spinner />)

    const spinnerSvg = screen.getByTestId('spinner-svg')
    expect(spinnerSvg).toHaveAttribute('width', '10')
    expect(spinnerSvg).toHaveAttribute('height', '10')
    expect(spinnerSvg).toHaveStyle({ color: '#f15f41' })
  })

  it('renders with custom size and color', () => {
    render(<Spinner size={20} color='#123456' />)

    const spinnerSvg = screen.getByTestId('spinner-svg')
    expect(spinnerSvg).toHaveAttribute('width', '20')
    expect(spinnerSvg).toHaveAttribute('height', '20')
    expect(spinnerSvg).toHaveStyle({ color: '#123456' })
  })
})
