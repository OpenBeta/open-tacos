import React from 'react'
import { render, screen } from '@testing-library/react'
import MapsLoading from '../loading'

describe('MapsLoading', () => {
  it('renders map loading message and status indicator', () => {
    render(<MapsLoading />)

    expect(screen.getByRole('heading', { name: /loading map/i })).toBeInTheDocument()
    expect(screen.getByText(/fetching climbing areas and crag coordinates/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
