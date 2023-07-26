import { toast } from 'react-toastify'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_PROFILE, QUERY_GET_USERNAME_BY_UUID, QUERY_DOES_USERNAME_EXIST, QUERY_GET_USER_PUBLIC_PAGE, GetUserPublicProfileByUuidReturn, QUERY_GET_USER_PUBLIC_PROFILE_BY_UUID } from '../graphql/gql/users'
import { Username } from '../types'
import { UserPublicProfile } from '../types/User'

interface GetUsernameByIdInput {
  userUuid: string
}
interface UpdateUsernameInput {
  userUuid: string
  username: string
  email?: string
  avatar?: string
}

type UpdateUserPublicProfileInput = { userUuid: string } & Pick<UserPublicProfile, 'displayName' | 'bio' | 'website'>

type GetUsernameById = (input: GetUsernameByIdInput) => Promise<Username | null>

type UpdateUsername = (input: UpdateUsernameInput) => Promise<boolean>

type UpdatePublicProfileCmd = (input: UpdateUserPublicProfileInput) => Promise<boolean>

type DoesUsernameExist = (username: string) => Promise<boolean | 'error'>

type GetUserPublicPage = (username: string) => Promise<any | null>

type GetUserPublicProfileByUuid = (userUuid: string) => Promise<UserPublicProfile | null>

interface ReturnType {
  getUsernameById: GetUsernameById
  updateUsername: UpdateUsername
  doesUsernameExist: DoesUsernameExist
  getUserPublicPage: GetUserPublicPage
  getUserPublicProfileByUuid: GetUserPublicProfileByUuid
  updatePublicProfileCmd: UpdatePublicProfileCmd
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
    const res = await graphqlClient.mutate<{ updateUserProfile?: boolean }, UpdateUsernameInput>({
      mutation: MUTATION_UPDATE_PROFILE,
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
    return res.data?.updateUserProfile ?? false
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

  const getUserPublicPage = async (username: string): Promise<any | null> => {
    const res = await graphqlClient.query<{ getUserPublicPage: any }, { username: string }>({
      query: QUERY_GET_USER_PUBLIC_PAGE,
      variables: {
        username
      },
      fetchPolicy: 'no-cache'
    })
    return res.data.getUserPublicPage
  }

  const getUserPublicProfileByUuid = async (userUuid: string): Promise<any | null> => {
    const res = await graphqlClient.query<GetUserPublicProfileByUuidReturn, { userUuid: string }>({
      query: QUERY_GET_USER_PUBLIC_PROFILE_BY_UUID,
      variables: {
        userUuid
      },
      fetchPolicy: 'no-cache'
    })
    return res.data.getUserPublicProfileByUuid
  }

  const updatePublicProfileCmd: UpdatePublicProfileCmd = async ({ userUuid, displayName, bio, website }: UpdateUserPublicProfileInput) => {
    const trimmedInput: UpdateUserPublicProfileInput = {
      userUuid,
      ...displayName != null && { displayName },
      ...bio != null && { bio },
      ...website != null && { website }
    }
    try {
      const res = await graphqlClient.mutate<{ updateUserProfile?: boolean }, UpdateUserPublicProfileInput>({
        mutation: MUTATION_UPDATE_PROFILE,
        variables: {
          ...trimmedInput
        },
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        },
        fetchPolicy: 'no-cache'
      })
      return res.data?.updateUserProfile ?? false
    } catch (e: any) {
      console.error(e)
      return false
    }
  }
  // const updatePublicProfile = async (userUuid: string): Promise<any | null> => {
  //   const res = await graphqlClient.mutate<GetUserPublicProfileByUuidReturn, { userUuid: string }>({
  //     query: QUERY_GET_USER_PUBLIC_PROFILE_BY_UUID,
  //     variables: {
  //       userUuid
  //     },
  //     fetchPolicy: 'no-cache'
  //   })
  //   return res.data.getUserPublicProfileByUuid
  // }

  return { getUsernameById, updateUsername, doesUsernameExist, getUserPublicPage, getUserPublicProfileByUuid, updatePublicProfileCmd }
}
