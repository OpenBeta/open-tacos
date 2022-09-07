import { AutocompleteSource } from '@algolia/autocomplete-js'

import { areaSearchByName } from '../../../js/typesense/TypesenseClient'
import { QueryProps } from '../AreaSearchAutoComplete'

export const searchAreas = async (searchQuery: QueryProps, onSelect): Promise<AutocompleteSource<any>> => {
  return {
    sourceId: 'areaSearch',

    getItems: async ({ query }) => await areaSearchByName(query, searchQuery.data.latlng),

    getItemInputValue: ({ item }): string => {
      return item.name
    },

    onSelect: async ({ item, refresh }): Promise<void> => {
      if (onSelect != null) {
        await refresh()
        onSelect(item)
      }
    },

    templates: {
      noResults: () => 'No results',

      item: ({ item }) => {
        return (
          <div>
            <div>{item.name}</div>
            <div className='px-4 text-base-300 breadcrumbs text-sm'>
              <ul className='flex-wrap'>
                {item.pathTokens.map((token: string, idx: number) => (<li key={idx}>{token}</li>))}
              </ul>
            </div>
          </div>
        )
      }
    }
  }
}
