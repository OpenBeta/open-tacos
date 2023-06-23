import { NextApiHandler } from 'next'
import withAuth from '../withAuth'
import { CreateUserData } from 'auth0'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { UserRole } from '../../../js/types'

import { auth0ManagementClient } from '../../../js/auth/ManagementClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

/**
 * @deprecated This endpoint was created to migrate Auth0 passwordless accounts to
 * email/password
 */
const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (session?.user.metadata?.roles?.includes(UserRole.USER_ADMIN) ?? false) {
      const userId = req.query?.id as string
      if (userId == null) throw new Error('Invalid user id')

      const oldUser = await auth0ManagementClient.getUser({ id: userId })
      if (oldUser?.email == null || oldUser?.user_metadata == null) {
        throw new Error('Missing email/user_metadata in Auth0.')
      }

      const newUserMetadata = Object.assign({}, oldUser.user_metadata)
      delete newUserMetadata.migrated
      delete newUserMetadata.migratedDate

      const newUserData: CreateUserData = {
        connection: 'Username-Password-Authentication',
        email: oldUser.email,
        user_metadata: newUserMetadata,
        email_verified: true,
        password: safeRandomString()
      }

      await auth0ManagementClient.createUser(newUserData)
      oldUser.user_metadata.migratedDate = new Date(Date.now()).toISOString()

      await auth0ManagementClient.updateUserMetadata({ id: userId }, oldUser.user_metadata)
      res.json({ message: 'OK' })
    } else {
      res.status(401).json({ message: 'Migration failed: user not authorized', errorCode: 3 })
    }
  } catch (e) {
    res.status(503).json({ message: `Unexpected error: ${e.message as string}`, errorCode: 2 })
  }
}

const safeRandomString = customAlphabet(nolookalikesSafe, 20)

export default withAuth(handler)
