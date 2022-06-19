import { NextApiHandler } from 'next'
import withAuth from '../withAuth'
import createMetadataClient from './metadataClient'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const metadataClient = await createMetadataClient(req)

    if (metadataClient == null) throw new Error('Can\'t create ManagementAPI client')

    const meta = await metadataClient.getUserMetadata()
    if (meta?.nick != null) {
      res.writeHead(307, { Location: `/u/${meta.nick}` }).end()
    } else {
      res.writeHead(307, { Location: '/' }).end()
    }
  } catch (e) {
    res.writeHead(307, { Location: '/' }).end()
  }
}

export default withAuth(handler)
