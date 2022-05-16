import { AutocompleteSource } from '@algolia/autocomplete-js'

import { MiniClimbItem } from '../templates/ClimbResultForTagging'
import { climbSearchByName } from '../../../js/typesense/TypesenseClient'
import { TypesenseDocumentType } from '../../../js/types'

/**
 * Search Typesense API by climb name and wrap the result in Algolia.Source object
 * to allow Autocomplete component to render the result.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * @param query search string
 * @param onSelect receive a callback when the user selects a result item
 */
export const TypesenseClimbNameSource = async (query: string, onSelect: (item: TypesenseDocumentType) => void): Promise<AutocompleteSource<TypesenseDocumentType>> => {
  const rs = await climbSearchByName(query)
  return await Promise.resolve({
    sourceId: 'climbsForTagging',
    getItems: async ({ query }) => rs,
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
  })
}
