import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { graphqlClient } from '../graphql/Client'
import { QUERY_DOES_USERNAME_EXIST, QUERY_GET_USERNAME_BY_UUID } from '../graphql/gql/users'

const _doesUsernameExist = async (username: string): Promise<boolean> => {
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
    return true
  }
}

/**
 * Check to see if a username already exists in the database
 */
export const doesUsernameExist = AwesomeDebouncePromise(
  _doesUsernameExist,
  350
)

export const getUsernameById = async (userUuid: string): Promise<any> => {
  const res = await graphqlClient.query<{ getUsername: any }, { userUuid: string }>({
    query: QUERY_GET_USERNAME_BY_UUID,
    variables: {
      userUuid
    },
    fetchPolicy: 'no-cache'
  })
  return res.data.getUsername
}

export const updateUsername = async (username: string): Promise<void> => {

}
