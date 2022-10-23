import { NextApiHandler } from 'next'
import * as jose from 'jose'
import { AUTH_CONFIG_SERVER } from '../../../Config'

if (AUTH_CONFIG_SERVER?.nextauthSecret == null) {
  console.error('Missing ')
}

const handler: NextApiHandler = async (req, res) => {
  if (AUTH_CONFIG_SERVER?.nextauthSecret == null) {
    res.end()
  }
  if (req.query?.token != null) {
    // console.log('#JWT', req.query?.token)
    const token = await jose.jwtVerify(req.query?.token as string, Buffer.from(AUTH_CONFIG_SERVER?.nextauthSecret ?? ''))
    // console.log('JSON Web Token', token)
    res.json({ userId: token.payload.sub })
  } else {
    res.end()
  }
}

export default handler
