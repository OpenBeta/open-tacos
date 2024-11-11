import * as Auth0 from 'auth0'

import { AUTH_CONFIG_SERVER } from '../../Config'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

if (process.env.MOBILE_AUTH_SECRET == null) {
  console.warn('Mobile auth secret not found')
}

const { clientSecret, clientId, issuer } = AUTH_CONFIG_SERVER

// Set up Auth0 client
export const auth0Client = new Auth0.AuthenticationClient({
  domain: issuer.replace('https://', ''),
  clientId,
  clientSecret
})

export const isNullOrEmpty = (str: string | null | undefined): boolean => {
  return str == null || str?.trim() === ''
}
