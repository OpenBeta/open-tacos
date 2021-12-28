import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

export const client = axios.create({
  baseURL: 'https://climb-api.openbeta.io/geocode/v1'
})

const debounced_api_get = AwesomeDebouncePromise(client.get, 200)

export const search_climbs_by_name = async (name) => {
  return await _api(debounced_api_get, [`/climbs?name=${name}`])
}

export const search_climbs_by_fa = async (fa_name) => {
  return await _api(debounced_api_get, [`/climbs?fa=${fa_name}`])
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
