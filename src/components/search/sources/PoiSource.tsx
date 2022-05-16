import { AutocompleteSource } from '@algolia/autocomplete-js'

import { geocoderLookup } from '../../../js/mapbox/Client'

/**
 * Call Mapbox Geocoder to return cities, landmarks, and point-of-interests that match 'query'.
 * @param query search string
 */
export const searchPoi = async (query: string): Promise<AutocompleteSource<any> | undefined> => {
  const rs = await geocoderLookup(query)
  return {
    sourceId: 'poi',
    getItems: ({ query }) => rs,
    templates: {
      noResults: () => {
        return 'No results.'
      },
      item: ({ item }) => {
        return <div className='text-xs'>{item.place_name}</div>
      },
      header: Header
    }
  }
}

const Header = (props: any): JSX.Element => {
  return (<div className='bg-green-200'>Place header</div>)
}
