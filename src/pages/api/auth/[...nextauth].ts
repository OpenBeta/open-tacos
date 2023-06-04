import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

import { AUTH_CONFIG_SERVER } from '../../../Config'
import { IUserMetadata, UserRole } from '../../../js/types/User'

const CustomClaimsNS = 'https://tacos.openbeta.io/'
const CustomClaimUserMetadata = CustomClaimsNS + 'user_metadata'
const CustomClaimRoles = CustomClaimsNS + 'roles'

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
      authorization: { params: { audience: `${issuer}/api/v2/`, scope: 'access_token_authz openid email profile read:current_user create:current_user_metadata update:current_user_metadata read:stats update:area_attrs' } },
      client: {
        token_endpoint_auth_method: clientSecret.length === 0 ? 'none' : 'client_secret_basic'
      }
    })
  ],
  debug: false,
  events: {},
  pages: {
    // signIn: '/auth/signin'
    verifyRequest: '/auth/verify-request'
  },
  theme: {
    colorScheme: 'light',
    brandColor: '#F15E40', // Hex color code
    logo: 'https://openbeta.io/_next/static/media/openbeta-logo-with-text.3621d038.svg', // Absolute URL to image
    buttonText: '#111826' // Hex color code
  },
  callbacks: {
    // See https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt ({ token, account, profile, user }) {
      if (account?.access_token != null) {
        token.accessToken = account.access_token
      }
      if (profile?.sub != null) {
        token.id = profile.sub
      }
      if (profile?.[CustomClaimUserMetadata] != null) {
        // null guard needed because profile object is only available once
        token.userMetadata = (profile?.[CustomClaimUserMetadata] as IUserMetadata)
        const customClaimRoles = profile?.[CustomClaimRoles] as string[] ?? []
        token.userMetadata.roles = customClaimRoles.map((r: string) => UserRole[r.toUpperCase()])
      }

      return token
    },
    async session ({ session, user, token }) {
      if (token.userMetadata == null ||
        token?.userMetadata?.uuid == null || token?.userMetadata?.nick == null) {
        // we must have user uuid and nickname for everything to work
        throw new Error('Missing user uuid and nickname from Auth provider')
      }

      session.user.metadata = token.userMetadata
      session.accessToken = token.accessToken
      session.id = token.id
      return session
    }
  }
})
