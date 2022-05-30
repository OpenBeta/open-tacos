import { NextApiHandler } from 'next'

import withAuth from '../withAuth'
import createMetadataClient, { Auth0UserMetadata } from './metadataClient'

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

const updateProfile: Handler = async (req, res) => {
  const metadataClient = await createMetadataClient(req)
  if (metadataClient == null) {
    return res.status(401).end()
  }

  try {
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
      return updateProfile(req, res)
    default:
      return res.status(405).end()
  }
}

export default withAuth(userHandler)
