import { AutocompleteSource } from '@algolia/autocomplete-js'
import { geocoderLookup } from '../../../js/mapbox/Client'
import { BaseItem } from '@algolia/autocomplete-core'

import { wizardActions } from '../../../js/stores/wizards'

interface PoiDoc extends BaseItem {
  text: string
  id: string
  place_name: string
  center: number[]
}

/**
 * Call Mapbox Geocoder to find cities, landmarks, and point-of-interests that
 * match 'query'.  Wrap result in Algolia.Source object to allow Autocomplete component.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * to render the result.
 * @param query search string
 */
export const searchPoi = async (query: string): Promise<AutocompleteSource<any>> => {
  // const rs =

  return {
    sourceId: 'poiSearch',

    getItems: async ({ query }) => await geocoderLookup(query),

    getItemInputValue: ({ item }: {item: PoiDoc}) => {
      return item.place_name
    },

    onSelect: ({ item }: {item: PoiDoc}) => {
      wizardActions.addAreaStore.recordStep1a(item.place_name, item.center)
    },

    templates: {
      noResults: () => 'No results',

      item: ({ item }: {item: PoiDoc}) => {
        return <div>{item.place_name}</div>
      }
    }
  }
}
