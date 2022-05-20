import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

const clientSecret = process.env.AUTH0_CLIENT_SECRET ?? ''

if (process.env.NODE_ENV === 'production' && clientSecret.length === 0) {
  throw new Error('AUTH0_CLIENT_SECRET is required in production')
}

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret,
      issuer: process.env.AUTH0_DOMAIN,
      authorization: { params: { audience: `${process.env.AUTH0_DOMAIN ?? ''}/api/v2/`, scope: 'openid email profile read:current_user create:current_user_metadata update:current_user_metadata' } },
      client: {
        token_endpoint_auth_method: clientSecret.length === 0 ? 'none' : 'client_secret_basic'
      }
    })
  ],
  callbacks: {
    async jwt ({ token, account }) {
      if (account?.access_token != null) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }

})
