import { NextApiHandler } from 'next'
import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata } from './metadataClient'

const handler: NextApiHandler<Auth0UserMetadata> = async (req, res) => {
  const metadataClient = await createMetadataClient(req)
  if (metadataClient != null) {
    const meta = await metadataClient.getUserMetadata()
    if (meta?.nick != null) {
      res.redirect(307, `/u/${meta.nick}`).end()
    } else {
      res.redirect(307, '/') // these extra else is to prevent 'ERR_HTTP_HEADERS_SENT' error
    }
  } else {
    res.redirect(307, '/')
  }
}

export default withAuth(handler)
