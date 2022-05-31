
import React from 'react'

import { useSession } from 'next-auth/react'

/**
 * Higher-order function to conditionally render a UI component
 * if the user has logged in, return null otherwise.
 * @param Component to be rendered
 */
const withAuthComponent = <P>(Component: React.FunctionComponent<P>): React.FunctionComponent<P> => {
  const AuthenticatedFC = (props: P): null | React.FunctionComponentElement<P> => {
    const { status } = useSession()
    if (status === 'authenticated') {
      return React.createElement(Component, props)
    }
    return null
  }

  return AuthenticatedFC
}

export default withAuthComponent
