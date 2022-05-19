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
      client: {
        token_endpoint_auth_method: clientSecret.length === 0 ? 'none' : 'client_secret_basic'
      }
    })
  ]
})
