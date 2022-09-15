
import React from 'react'

import { WithOwnerProfile } from '../types/User'
import usePermissions from '../hooks/auth/usePermissions'

type Fn<P> = (props: P) => JSX.Element | null
/**
 * Higher-order function to conditionally render a UI component
 * if the user currently authenticated is the same as the component owner.
 * @param Component to be rendered
 */
const forOwnerOnly = <P extends WithOwnerProfile>(Component: Fn<P>): (props: P) => React.FunctionComponentElement<P> | null => {
  if (Component == null) return () => null
  const AuthenticatedFC = (props: P): null | React.FunctionComponentElement<P> => {
    const { isAuthorized } = usePermissions({ ownerProfileOnPage: props.ownerProfile })
    if (isAuthorized) {
      return React.createElement(Component, props)
    }
    return null
  }

  return AuthenticatedFC
}

export default forOwnerOnly
