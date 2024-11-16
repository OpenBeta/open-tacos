import { getClient } from '../graphql/ServerClient'
import { MUTATION_UPDATE_PROFILE, QUERY_DOES_USERNAME_EXIST } from '../graphql/gql/users'
import { updateUser } from './ManagementClient'

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

export const initializeUserInDB = async (params: InitializeUserInDBParams): Promise<boolean> => {
  const { auth0UserId, accessToken, userUuid, username, email, avatar } = params
  const existed = await doesUserExist(username)
  if (existed) {
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

const doesUserExist = async (username: string): Promise<boolean> => {
  const res = await serverClient.query<{ usernameExists: boolean }, { username: string }>({
    query: QUERY_DOES_USERNAME_EXIST,
    variables: {
      username
    },
    fetchPolicy: 'no-cache'
  })
  return res.data.usernameExists
}
