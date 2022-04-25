import { AutocompleteSource } from '@algolia/autocomplete-js'

import { multiSearch } from '../../../js/typesense/TypesenseClient'

/**
 * Call Typesense search API and wrap the result in Algolia.Source object
 * which contains matching climbs, areas, fa.  To map the data to UI components,
 *  we use Algolia.reshape() to destructure the combined Source to 'Climb source',
 * 'Area source', 'FA source', etc.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * @param query search string
 */
export const searchTypesense = (query: string): AutocompleteSource<any> | undefined => {
  return {
    sourceId: 'typesense',
    getItems: async ({ query }) => await multiSearch(query),
    templates: {
      noResults: () => {
        return 'No results.'
      },
      item: ({ item }) => {
        return <div>{JSON.stringify(item, null, 2)}</div>
      }
    }
  }
}
