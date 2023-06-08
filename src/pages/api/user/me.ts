import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'

import withAuth from '../withAuth'
import useUserProfileCmd from '../../../js/hooks/useUserProfileCmd'

const handler: NextApiHandler<any> = async (req, res) => {
  const session = await getSession({ req })

  const uuid = session?.user.metadata.uuid

  if (uuid == null) {
    res.writeHead(307, { Location: '/' }).end()
    return
  }

  try {
    const { getUsernameById } = useUserProfileCmd({ accessToken: uuid })
    const usernameInfo = await getUsernameById({ userUuid: uuid })
    if (usernameInfo?.username == null) {
      res.writeHead(307, { Location: '/' }).end()
    } else {
      res.writeHead(307, { Location: `/u/${usernameInfo.username}` }).end()
    }
  } catch (e) {
    res.writeHead(307, { Location: '/' }).end()
  }
}

export default withAuth(handler)
