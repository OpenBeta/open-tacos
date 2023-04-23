
import React from 'react'
import { WithOwnerProfile } from '../types/User'
import usePermissions from '../hooks/auth/usePermissions'

/**
 * A function type that takes a set of props of type P and returns a JSX element or null.
 * @template P - The type of the props passed to the function.
 * @param {P} props - The props passed to the function.
 * @returns {JSX.Element | null} - The JSX element returned by the function, or null.
 */
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
