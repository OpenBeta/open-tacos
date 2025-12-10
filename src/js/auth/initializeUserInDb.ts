import { getClient } from '../graphql/ServerClient'
import { MUTATION_UPDATE_PROFILE, QUERY_GET_USERNAME_BY_UUID } from '../graphql/gql/users'
import { updateUser } from './ManagementClient'
import { Username } from '../types'
export interface UpdateUsernameInput {
  userUuid: string
  username: string
  email?: string | null
  avatar?: string | null
}

interface InitializeUserInDBParams extends UpdateUsernameInput {
  accessToken: string
  auth0UserId: string
}

const serverClient = getClient()

/**
 * Look up in our db (not Auth0) to see whether a user by uuid exists.  If it doesn't then insert a new user profile.
 */
export const initializeUserInDB = async (params: InitializeUserInDBParams): Promise<boolean> => {
  const { auth0UserId, accessToken, userUuid, username, email, avatar } = params
  const existed = await doesUserByUuidExist(userUuid)
  if (existed != null) {
    return false
  }
  const res = await serverClient.mutate<{ updateUserProfile?: boolean }, UpdateUsernameInput>({
    mutation: MUTATION_UPDATE_PROFILE,
    variables: {
      userUuid,
      username,
      email,
      avatar
    },
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    },
    fetchPolicy: 'no-cache'
  })
  const success = res.data?.updateUserProfile ?? false
  if (success) {
    try {
      await updateUser(auth0UserId, { initializedDb: true })
    } catch (error) {
      console.log('Error initializing user in db')
      return false
    }
  }
  return success
}

const doesUserByUuidExist = async (userUuid: string): Promise<Username | null> => {
  const res = await serverClient.query<{ getUsername?: Username }, { userUuid: string }>({
    query: QUERY_GET_USERNAME_BY_UUID,
    variables: {
      userUuid
    },
    fetchPolicy: 'no-cache'
  })
  return res.data?.getUsername ?? null
}
