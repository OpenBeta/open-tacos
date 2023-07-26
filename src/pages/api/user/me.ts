import { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

import withAuth from '../withAuth'
import useUserProfileCmd from '../../../js/hooks/useUserProfileCmd'

const handler: NextApiHandler<any> = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  const uuid = session?.user.metadata.uuid

  if (uuid == null) {
    res.writeHead(307, { Location: '/' }).end()
    return
  }

  const isPreview = req.query?.preview != null

  try {
    const { getUsernameById } = useUserProfileCmd({ accessToken: uuid })
    const usernameInfo = await getUsernameById({ userUuid: uuid })
    if (usernameInfo?.username == null) {
      res.writeHead(307, { Location: '/' }).end()
    } else {
      const Location = isPreview ? `/u2/${usernameInfo.username}` : `/u/${usernameInfo.username}`
      res.writeHead(307, { Location }).end()
    }
  } catch (e) {
    res.writeHead(307, { Location: '/' }).end()
  }
}

export default withAuth(handler)
