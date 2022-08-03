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

const _loadCollections = async (): Promise<any> => {
  try {
    const res = await client.get('/api/user/fav2')
    if (res.status === 200) {
      return res.data
    }
    return null
  } catch (e) {
    return null
  }
}

export const loadCollections = AwesomeDebouncePromise(
  _loadCollections,
  5000
)
