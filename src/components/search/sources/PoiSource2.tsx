import { AutocompleteSource } from '@algolia/autocomplete-js'
import { BaseItem } from '@algolia/autocomplete-core'

import { geocoderLookup, ArrayOfFeatures, MapboxDoc } from '../../../js/mapbox/Client'

export interface PoiDoc extends BaseItem {
  text: string
  id: string
  place_name: string
  center: number[] // [lng, lat]
  countryCode: string // ISO alpha 2
}

/**
 * Call Mapbox Geocoder to find cities, landmarks, and point-of-interests.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 */
export const searchPoi = async (onSelect): Promise<AutocompleteSource<any>> => {
  return {
    sourceId: 'poiSearch',

    getItems: async ({ query }) => {
      const rs = await geocoderLookup(query)
      return transform(rs)
    },

    getItemInputValue: ({ item }: {item: PoiDoc}) => {
      return item.place_name
    },

    onSelect: async ({ item, refresh }): Promise<void> => {
      await refresh()
      onSelect(item)
    },

    templates: {
      noResults: () => 'No results',

      item: ({ item }: {item: PoiDoc}) => {
        return (
          <div>{item.place_name}</div>
        )
      }
    }
  }
}

// Parse Mapbox item for ISO country code
// See https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
const extractCountry = (item: MapboxDoc): PoiDoc => {
  let countryCode = ''
  if (item.place_type.includes('country')) {
    countryCode = item.properties.short_code
  } else if (item?.context != null && (item?.context?.length ?? 0) > 0) {
    countryCode = item.context[item.context?.length - 1]?.short_code
  }

  return {
    text: item.text,
    id: item.id,
    place_name: item.place_name,
    center: item.center,
    countryCode
  }
}

const transform = (items: ArrayOfFeatures): PoiDoc[] => {
  return items.map(extractCountry)
}
