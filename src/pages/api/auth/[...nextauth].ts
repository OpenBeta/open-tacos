import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

import { AUTH_CONFIG_SERVER } from '../../../Config'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')
const { clientSecret, clientId, issuer } = AUTH_CONFIG_SERVER

if (process.env.NODE_ENV === 'production' && clientSecret.length === 0) {
  throw new Error('AUTH0_CLIENT_SECRET is required in production')
}

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId,
      clientSecret,
      issuer,
      authorization: { params: { audience: `${issuer}/api/v2/`, scope: 'openid email profile read:current_user create:current_user_metadata update:current_user_metadata' } },
      client: {
        token_endpoint_auth_method: clientSecret.length === 0 ? 'none' : 'client_secret_basic'
      }
    })
  ],
  callbacks: {
    async jwt ({ token, account, profile }) {
      if (account?.access_token != null) {
        token.accessToken = account.access_token
      }
      if (profile?.sub != null) {
        token.id = profile.sub
      }
      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken
      session.id = token.id
      return session
    }
  }

})
