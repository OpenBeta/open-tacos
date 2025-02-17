import axios from 'axios'
import type { NextAuthOptions } from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

import { AUTH_CONFIG_SERVER } from '../../../../Config'
import { IUserMetadata, UserRole } from '../../../../js/types/User'
import { initializeUserInDB } from '@/js/auth/initializeUserInDb'

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
      authorization: {
        params: {
          audience: 'https://api.openbeta.io',
          scope: 'offline_access access_token_authz openid email profile read:current_user create:current_user_metadata update:current_user_metadata read:stats update:area_attrs'
        }
      },
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
      /**
         * `account` object is only populated once when the user first logged in.
         */
      if (account?.access_token != null) {
        token.accessToken = account.access_token
      }

      if (account?.refresh_token != null) {
        token.refreshToken = account.refresh_token
      }

      /**
         * `account.expires_at` is set in Auth0 custom API
         *  Applications -> API -> (OB Climb API) -> Access Token Settings -> Implicit/Hybrid Access Token Lifetime
         */
      if (account?.expires_at != null) {
        token.expiresAt = account.expires_at
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

      if (token?.refreshToken == null || token?.expiresAt == null) {
        throw new Error('Invalid auth data')
      }

      if (!(token.userMetadata?.initializedDb ?? false)) {
        const { userMetadata, email, picture: avatar, id: auth0UserId } = token
        const { nick: username, uuid: userUuid } = userMetadata
        const { accessToken } = token

        const success = await initializeUserInDB({ auth0UserId, accessToken, username, userUuid, avatar, email })
        if (success) {
          token.userMetadata.initializedDb = true
        }
      }

      if ((token.expiresAt as number) < (Date.now() / 1000)) {
        const { accessToken, refreshToken, expiresAt } = await refreshAccessTokenSilently(token.refreshToken as string)
        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.expiresAt = expiresAt
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

const refreshAccessTokenSilently = async (refreshToken: string): Promise<any> => {
  const response = await axios.request<{
    access_token: string
    refresh_token: string
    expires_in: number
  }>({
    method: 'POST',
    url: `${issuer}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  })

  /* eslint-disable @typescript-eslint/naming-convention */
  const {
    access_token, refresh_token, expires_in
  } = response.data

  if (access_token == null || refresh_token == null || expires_in == null) {
    throw new Error('Missing data in refresh token flow')
  }

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: Math.floor((Date.now() / 1000) + expires_in)
  }
}
