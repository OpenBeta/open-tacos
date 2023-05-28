import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_USERNAME, QUERY_GET_USERNAME_BY_UUID } from '../graphql/gql/users'
import { Username } from '../types'

interface GetUsernameByIdInput {
  userUuid: string
}
interface UpdateUsernameInput {
  userUuid: string
  username: string
}

type GetUsernameById = (input: GetUsernameByIdInput) => Promise<Username>

type UpdateUsername = (input: UpdateUsernameInput) => Promise<boolean>

interface ReturnType {
  getUsernameById: GetUsernameById
  updateUsername: UpdateUsername
}

export default function useUserProfileCmd (): ReturnType {
  const getUsernameById = async (input: GetUsernameByIdInput): Promise<Username> => {
    const res = await graphqlClient.query<{ getUsername: Username }, GetUsernameByIdInput>({
      query: QUERY_GET_USERNAME_BY_UUID,
      variables: {
        ...input
      },
      fetchPolicy: 'no-cache'
    })
    return res.data.getUsername
  }

  const updateUsername = async (input: UpdateUsernameInput): Promise<boolean> => {
    console.log('#input', input)
    const res = await graphqlClient.query<{ updateUserProfile: boolean }, UpdateUsernameInput>({
      query: MUTATION_UPDATE_USERNAME,
      variables: {
        ...input
      },
      fetchPolicy: 'no-cache'
    })
    return res.data.updateUserProfile
  }

  return { getUsernameById, updateUsername }
}
