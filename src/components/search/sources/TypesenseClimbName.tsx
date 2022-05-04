import { AutocompleteSource } from '@algolia/autocomplete-js'

import { MiniClimbItem } from '../templates/ClimbResultForTagging'
import { climbSearchByName } from '../../../js/typesense/TypesenseClient'

/**
 * Call Typesense search API and wrap the result in Algolia.Source object
 * which contains matching climbs, areas, fa.  To map the data to UI components,
 *  we use Algolia.reshape() to destructure the combined Source to 'Climb source',
 * 'Area source', 'FA source', etc.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * @param query search string
 */
export const TypesenseClimbNameSource = (query: string, onSelect): AutocompleteSource<any> => {
  return {
    sourceId: 'climbsForTagging',
    getItems: async ({ query }) => await climbSearchByName(query),
    onSelect ({ item, setQuery, setIsOpen, refresh }) {
      setIsOpen(false)
      onSelect(item)
    },
    getItemInputValue: ({ item }) => {
      return item.climbName
    },
    templates: {
      item: MiniClimbItem,
      header: () => null
    }
  }
}
