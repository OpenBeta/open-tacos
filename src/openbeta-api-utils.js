import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

export const client = axios.create({
  baseURL: 'https://climb-api.openbeta.io/geocode/v1'
})

const debouncedApiGet = AwesomeDebouncePromise(client.get, 200)

export const searchClimbsByName = async (name) => {
  return await _api(debouncedApiGet, [`/climbs?name=${name}`])
}

export const searchClimbsByFa = async (faName) => {
  return await _api(debouncedApiGet, [`/climbs?fa=${faName}`])
}

/**
 * API call helper with error handling
 * @param {api} api
 * @param {[*]} args
 */
const _api = async (api, args) => {
  try {
    const res = await api.apply(this, args)
    if (res.status === 200) {
      return res.data
    } else {
      return []
    }
  } catch (error) {
    // can be general network errors or due to API rate limitings
    console.log('API error ', error)
    return []
  }
}
