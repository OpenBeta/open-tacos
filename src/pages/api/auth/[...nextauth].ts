import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

import { AUTH_CONFIG_SERVER } from '../../../Config'
import { IUserMetadata } from '../../../js/types/User'

const CustomClaimsNS = 'https://tacos.openbeta.io/'
const CustomClaimUserMetadata = CustomClaimsNS + 'user_metadata'

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
  debug: false,
  events: {},
  callbacks: {
    async jwt ({ token, account, profile, user }) {
      if (account?.access_token != null) {
        token.accessToken = account.access_token
      }
      if (profile?.sub != null) {
        token.id = profile.sub
      }
      if (profile?.[CustomClaimUserMetadata] != null) {
        token.userMetadata = (profile?.[CustomClaimUserMetadata] as IUserMetadata)
      }
      return token
    },
    async session ({ session, user, token }) {
      if (token.userMetadata == null) {
        // we must have user metadata for everything to work
        throw new Error('Missing user metadata from Auth provider')
      }
      session.user.metadata = token.userMetadata
      session.accessToken = token.accessToken
      session.id = token.id
      return session
    }
  }

})
