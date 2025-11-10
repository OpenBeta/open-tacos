import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/react'
import { VerifyEmailPendingContent } from '../VerifyEmailPendingContent'

const mockReplace = jest.fn()
const mockSearchParams = new Map([['session_token', 'test-token-123']])

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ status: 'unauthenticated' })),
  signIn: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: mockReplace })),
  useSearchParams: jest.fn(() => ({
    get: (key: string) => mockSearchParams.get(key)
  }))
}))

jest.mock('axios', () => ({
  get: async () => await Promise.resolve({ data: { auth0UserId: 'test-user' } }),
  post: async () => await Promise.resolve({ data: { success: true } })
}))

describe('VerifyEmailPendingContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<VerifyEmailPendingContent />)
    expect(screen.getByText(/Look for a verification email/i)).toBeInTheDocument()
  })

  it('displays resend button', () => {
    render(<VerifyEmailPendingContent />)
    expect(screen.getByText(/Resend verification email/i)).toBeInTheDocument()
  })

  it('displays login link', () => {
    render(<VerifyEmailPendingContent />)
    expect(screen.getByText(/Already verified\? Login/i)).toBeInTheDocument()
  })

  it('redirects when user becomes authenticated', async () => {
    const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>
    mockedUseSession.mockReturnValue({ status: 'authenticated' } as any)

    render(<VerifyEmailPendingContent />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/')
    })
  })

  it('calls signIn when login button is clicked', async () => {
    const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>

    render(<VerifyEmailPendingContent />)

    const loginButton = screen.getByText(/Already verified\? Login/i)

    await act(async () => {
      loginButton.click()
    })

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith('auth0')
    })
  })
})
