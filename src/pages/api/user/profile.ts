import { NextApiHandler } from 'next'

import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata } from './metadataClient'
import { checkUsername } from '../../../js/utils'

type Handler = NextApiHandler<Auth0UserMetadata | { message: string }>

const getProfile: Handler = async (req, res) => {
  const metadataClient = await createMetadataClient(req)
  if (metadataClient == null) {
    return res.status(401).end()
  }

  try {
    const metadata = await metadataClient.getUserMetadata()

    res.json(metadata)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}

const updateMyProfile: Handler = async (req, res) => {
  const metadataClient = await createMetadataClient(req)
  if (metadataClient == null) {
    return res.status(401).end()
  }

  try {
    if (!checkUsername(req.body?.nick)) {
      throw new Error('Bad username')
    }
    if (req.body?.name?.length > 150 || req.body?.bio?.length > 150) {
      throw new Error('Bad profile data')
    }
    req.body.nick = (req.body.nick as string).toLowerCase()
    const metadata = await metadataClient.updateUserMetadata(req.body)

    res.json(metadata)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}

const userHandler: NextApiHandler<Auth0UserMetadata> = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getProfile(req, res)
    case 'PATCH':
      return updateMyProfile(req, res)
    default:
      return res.status(405).end()
  }
}

export default withAuth(userHandler)
