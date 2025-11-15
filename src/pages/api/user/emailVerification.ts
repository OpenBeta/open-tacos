import { NextApiHandler, NextApiRequest } from 'next'
import * as jose from 'jose'
import { AUTH_CONFIG_SERVER } from '../../../Config'
import { sendEmailVerification } from '../../../js/auth/ManagementClient'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { nextauthSecret } = AUTH_CONFIG_SERVER

/**
 * JWT-verify 'session_token' from Auth0 postLogin action.  The userId to request new email verification
 * is in the JWT payload.  We want to make sure the token really comes from Auth0.
 * - GET: verify only
 * - POST: verify and send a verification email for the user.
 * @param endpoint /api/user/emailVerification?token=<Auth0 session_token>
 */
const handler: NextApiHandler = async (req, res) => {
  switch (req?.method) {
    case 'GET': {
      await verify(req)
      res.status(200).end()
      break
    }
    case 'POST': {
      const token = await verify(req)
      const auth0UserId = token.payload.sub
      await sendEmailVerification(auth0UserId)
      res.status(200).end()
      break
    }
    default: res.status(503).end()
  }
}

export default handler

const verify = async (req: NextApiRequest): Promise<any> => {
  const jwt = req.query?.token as string ?? null
  if (jwt != null) {
    return await jose.jwtVerify(jwt, Buffer.from(nextauthSecret))
  }
}
