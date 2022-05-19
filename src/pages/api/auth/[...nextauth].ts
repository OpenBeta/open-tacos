import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

export default NextAuth({
  providers: [
    // @ts-expect-error next-auth expects clientSecret but it is not used as token_endpoint_auth_method is set to none
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      issuer: process.env.AUTH0_DOMAIN,
      client: {
        token_endpoint_auth_method: 'none'
      }
    })
  ]
})
