import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import withAuth from '../withAuth'
import { CreateUserData } from 'auth0'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import axios from 'axios'
import { AUTH_CONFIG_SERVER } from '../../../Config'

import { auth0ManagementClient } from '../../../js/auth/ManagementClient'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const session = await getSession({ req })
    if (session?.user.metadata?.roles?.includes('user_admin') ?? false) {
      const userId = req.query?.id as string
      if (userId == null) throw new Error('Invalid user id')

      const oldUser = await auth0ManagementClient.getUser({ id: userId })
      if (oldUser.email == null) {
        throw new Error('Missing email in Auth0.')
      }

      const newUserData: CreateUserData = {
        connection: 'Username-Password-Authentication',
        email: oldUser.email,
        user_metadata: oldUser.user_metadata,
        email_verified: true,
        password: safeRandomString()
      }

      await auth0ManagementClient.createUser(newUserData)

      // const passTicket: PasswordChangeTicketParams = {
      //   result_url: 'https://openbeta.io',
      //   user_id: rs.user_id,
      //   mark_email_as_verified: false
      // }
      // const rs2 = await auth0ManagementClient.createPasswordChangeTicket(passTicket)
      const ok = await sendResetPassword(oldUser.email)
      if (ok) {
        res.json({ status: 'OK' })
      } else {
        res.status(503).json({ message: 'Error initiating reset email', errorCode: 1 })
      }
    } else {
      res.status(401).json({ message: 'Migration failed: user not authorized', errorCode: 3 })
    }
  } catch (e) {
    res.status(503).json({ message: `Unexpected error: ${e.message as string}`, errorCode: 2 })
  }
}

const safeRandomString = customAlphabet(nolookalikesSafe, 20)

export default withAuth(handler)

const sendResetPassword = async (email: string): Promise<boolean> => {
  if (AUTH_CONFIG_SERVER == null) throw new Error('Missing Auth config')
  const { issuer, clientId } = AUTH_CONFIG_SERVER

  const headers = {
    'content-type': 'application/json'
  }

  const data = {
    client_id: clientId,
    email,
    connection: 'Username-Password-Authentication'
  }

  try {
    const rs = await axios.post(issuer, data, { headers })
    return rs.status === 200
  } catch (e) {
    return false
  }
}

// https://dev-fmjyader 'content-type: application/json' --data '{"client_id": "3qGOaKjDAL3LmZmoUR7nm6uWY69aI27z", "email": "nachoserrano@lavabit.com", "connection": "Username-Password-Authentication"}'
