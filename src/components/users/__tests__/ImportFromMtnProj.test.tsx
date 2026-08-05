import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import ImportFromMtnProj from '../ImportFromMtnProj'
import ''

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ status: 'authenticated' }))
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn(), push: jest.fn() }))
}))

jest.mock('../../../js/graphql/Client', () => ({

  graphqlClient: jest.fn()
}))

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    error: jest.fn()
  }
}))

describe('<ImportFromMtnProj />', () => {
  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={[]}>
        <ImportFromMtnProj username='testuser' />
      </MockedProvider>
    )
  })

  it('renders modal on button click', async () => {
    render(
      <MockedProvider mocks={[]}>
        <ImportFromMtnProj username='testuser' />
      </MockedProvider>
    )

    const button = screen.getByText('Import ticks')
    await waitFor(() => {
      act(() => {
        fireEvent.click(button)
      })
    })

    await waitFor(() => {
      const modalText = screen.getByText('Input your Mountain Project profile link')
      expect(modalText).toBeInTheDocument()
    })
  })

  it('accepts input for the Mountain Project profile link', async () => {
    render(<ImportFromMtnProj username='testuser' />
    )

    // Simulate a click to open the modal.
    const openModalButton = screen.getByText('Import ticks')
    await waitFor(() => {
      act(() => {
        fireEvent.click(openModalButton)
      })
    })

    // Use findBy to wait for the input field to appear.
    const inputField = await screen.findByPlaceholderText('https://www.mountainproject.com/user/123456789/username')

    if (!(inputField instanceof HTMLInputElement)) {
      throw new Error('Expected an input field')
    }

    // Simulate entering a Mountain Project URL.

    await waitFor(() => {
      act(() => {
        fireEvent.change(inputField, { target: { value: 'https://www.mountainproject.com/user/123456789/sampleuser' } })
      })
    })

    expect(inputField.value).toBe('https://www.mountainproject.com/user/123456789/sampleuser')
  })

  it('shows loading spinner and then success screen on valid submission', async () => {
    const mockFetch = jest.fn().mockImplementation(async () =>
      await Promise.resolve({
        json: async () => await Promise.resolve({ count: 42 })
      })
    )
    global.fetch = mockFetch

    render(<ImportFromMtnProj username='testuser' />)

    // Open the modal
    const openModalButton = screen.getByText('Import ticks')
    fireEvent.click(openModalButton)

    // Type in a valid link
    const inputField = await screen.findByPlaceholderText('https://www.mountainproject.com/user/123456789/username')
    fireEvent.change(inputField, { target: { value: 'https://www.mountainproject.com/user/123456789/sampleuser' } })

    // Click on Get my ticks
    const getTicksButton = screen.getByText('Get my ticks!')
    fireEvent.click(getTicksButton)

    // Expect loading state
    expect(screen.getByText('Fetching ticks from Mountain Project...')).toBeInTheDocument()

    // Expect success screen
    await waitFor(() => {
      expect(screen.getByText('42 ticks have been imported! 🎉')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Go to my ticks now' })).toHaveAttribute('href', '/u/testuser/ticks')
    })
  })
})
