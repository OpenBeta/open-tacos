import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

const client = axios.create()

const _checkUsername = async (nick: string): Promise<boolean> => {
  try {
    const res = await client.get<{found: boolean}>('/api/user/exists?nick=' + nick)
    if (res.status === 200) {
      return res.data.found
    }
    return true
  } catch (e) {
    return true
  }
}

export const doesUsernameExist = AwesomeDebouncePromise(
  _checkUsername,
  350
)
