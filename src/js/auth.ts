import { NextComponentType } from 'next'
import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'

/*
 *  Wrap a component to check that the user has a valid session.
 *  Redirect to the sign in page if the user is not authenticated.
*/
const withAuth = (Component: NextComponentType): NextComponentType | null => {
  const AuthenticatedComponent = (): JSX.Element | null => {
    const { status } = useSession()

    const isAuthenticated = status === 'authenticated'
    const isLoading = status === 'loading'

    useEffect(() => {
      if (isLoading) return
      if (!isAuthenticated) signIn('auth0').catch(() => {})
    }, [isAuthenticated, status])

    if (isAuthenticated) {
      return React.createElement(Component)
    }

    return null
  }

  return AuthenticatedComponent
}

export { withAuth }
