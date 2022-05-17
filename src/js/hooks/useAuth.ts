import { Auth0ContextInterface, useAuth0 } from '@auth0/auth0-react'

interface User { name: string }

const useAuth = (): Auth0ContextInterface<User> => useAuth0<User>()

export default useAuth
