import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import ImportFromMtnProj from '../ImportFromMtnProj'
import ''

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ status: 'authenticated' }))
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ replace: jest.fn() }))
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
      <MockedProvider mocks={[]} addTypename={false}>
        <ImportFromMtnProj username='testuser' />
      </MockedProvider>
    )
  })

  it('renders modal on button click', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
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
})
