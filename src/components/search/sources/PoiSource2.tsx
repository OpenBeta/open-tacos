import { AutocompleteSource } from '@algolia/autocomplete-js'
import { geocoderLookup } from '../../../js/mapbox/Client'
import { BaseItem } from '@algolia/autocomplete-core'

interface PoiDoc extends BaseItem {
  text: string
  id: string
  place_name: string
  center: number[]
}

/**
 * Call Mapbox Geocoder to find cities, landmarks, and point-of-interests.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 */
export const searchPoi = async (onSelect): Promise<AutocompleteSource<any>> => {
  return {
    sourceId: 'poiSearch',

    getItems: async ({ query }) => await geocoderLookup(query),

    getItemInputValue: ({ item }: {item: PoiDoc}) => {
      return item.place_name
    },

    onSelect: ({ item }: {item: PoiDoc}) => onSelect(item),

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
