import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { graphqlClient } from '../graphql/Client'
import { QUERY_DOES_USERNAME_EXIST } from '../graphql/gql/users'

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
