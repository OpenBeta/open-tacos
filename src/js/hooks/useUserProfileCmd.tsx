import { toast } from 'react-toastify'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_USERNAME, QUERY_GET_USERNAME_BY_UUID, QUERY_DOES_USERNAME_EXIST } from '../graphql/gql/users'
import { Username } from '../types'

interface GetUsernameByIdInput {
  userUuid: string
}
interface UpdateUsernameInput {
  userUuid: string
  username: string
}

type GetUsernameById = (input: GetUsernameByIdInput) => Promise<Username | null>

type UpdateUsername = (input: UpdateUsernameInput) => Promise<boolean>

type DoesUsernameExist = (username: string) => Promise<boolean | 'error'>

interface ReturnType {
  getUsernameById: GetUsernameById
  updateUsername: UpdateUsername
  doesUsernameExist: DoesUsernameExist
}

interface UseUserProfileCmdProps {
  accessToken?: string
}

export default function useUserProfileCmd ({ accessToken = '' }: UseUserProfileCmdProps): ReturnType {
  const getUsernameById = async (input: GetUsernameByIdInput): Promise<Username | null> => {
    try {
      const res = await graphqlClient.query<{ getUsername?: Username }, GetUsernameByIdInput>({
        query: QUERY_GET_USERNAME_BY_UUID,
        variables: {
          ...input
        },
        fetchPolicy: 'no-cache'
      })
      return res.data?.getUsername ?? null
    } catch (e) {
      toast.error('Unexpected error.  If the problem persists please notify support@openbeta.io.')
      return null
    }
  }

  const updateUsername = async (input: UpdateUsernameInput): Promise<boolean> => {
    const res = await graphqlClient.query<{ updateUserProfile: boolean }, UpdateUsernameInput>({
      query: MUTATION_UPDATE_USERNAME,
      variables: {
        ...input
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      },
      fetchPolicy: 'no-cache'
    })
    return res.data.updateUserProfile
  }

  const _doesUsernameExistFn = async (username: string): Promise<boolean | 'error'> => {
    try {
      const res = await graphqlClient.query<{ usernameExists: boolean }, { username: string }>({
        query: QUERY_DOES_USERNAME_EXIST,
        variables: {
          username
        },
        fetchPolicy: 'no-cache'
      })
      return res.data.usernameExists
    } catch (e) {
      return 'error'
    }
  }

  /**
   * Check to see if a username already exists in the database
   */
  const doesUsernameExist = AwesomeDebouncePromise(
    _doesUsernameExistFn,
    350
  )

  return { getUsernameById, updateUsername, doesUsernameExist }
}
