import { AutocompleteSource } from '@algolia/autocomplete-js'

import { geocoderLookup } from '../../../js/mapbox/Client'
import { DefaultHeader, DefaultNoResult } from '../templates/ClimbResultXSearch'

/**
 * Call Mapbox Geocoder to find cities, landmarks, and point-of-interests that
 * match 'query'.  Wrap result in Algolia.Source object to allow Autocomplete component.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * to render the result.
 * @param query search string
 */
export const searchPoi = async (query: string): Promise<AutocompleteSource<any> | undefined> => {
  const rs = await geocoderLookup(query)
  return {
    sourceId: 'poi',
    getItems: ({ query }) => rs,
    templates: {
      noResults: DefaultNoResult,
      item: ({ item }) => {
        return <div className='text-xs'>{item.place_name}</div>
      },
      header: DefaultHeader // you can also define your own header
    }
  }
}
