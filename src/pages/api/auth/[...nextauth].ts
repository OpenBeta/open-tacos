import NextAuth from 'next-auth'
import axios from 'axios'
import type { NextAuthOptions } from 'next-auth'
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

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId,
      clientSecret,
      issuer,
      authorization: { params: { audience: `${issuer}/api/v2/`, scope: 'offline_access access_token_authz openid email profile read:current_user create:current_user_metadata update:current_user_metadata read:stats update:area_attrs' } },
      client: {
        token_endpoint_auth_method: clientSecret.length === 0 ? 'none' : 'client_secret_basic'
      }
    })
  ],
  debug: false,
  events: {},
  pages: {
    verifyRequest: '/auth/verify-request',
    signIn: '/login'
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

      if (account?.refresh_token != null) {
        token.refreshToken = account.refresh_token
      }

      if (account?.expires_at != null) {
        token.expires_at = account.expires_at
      }

      if (profile?.sub != null) {
        token.id = profile.sub
      }
      // @ts-expect-error
      if (profile?.[CustomClaimUserMetadata] != null) {
        // null guard needed because profile object is only available once
        // @ts-expect-error
        token.userMetadata = (profile?.[CustomClaimUserMetadata] as IUserMetadata)
        // @ts-expect-error
        const customClaimRoles = profile?.[CustomClaimRoles] as string[] ?? []
        token.userMetadata.roles = customClaimRoles.map((r: string) => {
          return UserRole[r.toUpperCase() as keyof typeof UserRole]
        })
      }

      if (token?.refreshToken != null && token?.expires_at != null && ((token.expires_at as number) < (Date.now() / 1000))) {
        const response = await axios.request({
          method: 'POST',
          url: `${issuer}/oauth/token`,
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: token.refreshToken as string
          })
        })

        if (response.data.access_token == null) {
          throw new Error('No access token in refresh_token flow')
        }

        token.accessToken = response.data.access_token
        token.refreshToken = response.data.refresh_token
        token.expires_at = Math.floor((Date.now() / 1000) + (response.data.expires_in as number))
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
}

export default NextAuth(authOptions)
