import axios from 'axios'
import { Feature } from 'geojson'
import { NEXT_PUBLIC_MAPBOX_API_KEY } from '../../Config'

/**
 * Call Mapbox forward geocoder look up
 * @param query Search string. Eg: Smith Rock
 * @param apiToken Mapbox token
 * @param options Mapbox Geocoder API option
 */
export const geocoderLookup = async (
  query: string,
  options = {}
): Promise<Feature[]> => {
  console.log('### NEXT_PUBLIC_MAPBOX_API_KEY', NEXT_PUBLIC_MAPBOX_API_KEY)
  const safeQuery = encodeURI(query)
  const opts = Object.keys(options)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(options[k])}`)
    .join('&')
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${safeQuery}.json?access_token=${NEXT_PUBLIC_MAPBOX_API_KEY}&limit=3&${opts}`

  const response = await axios.get(url)
  return response.status === 200 && response.data !== undefined
    ? response.data.features
    : await Promise.reject(new Error('Mapbox Geocoder error'))
}
