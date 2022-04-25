import { AutocompleteSource } from '@algolia/autocomplete-js'

import { multiSearch } from '../../js/typesense/TypesenseClient'

/**
 * Call Typesense search API and return a Source object.
 * Since the search result contains complex data coming from multiple search indices,
 * we don't render the result directly in this component, but rather 'reshape',
 * destructure it into 'Climb source', 'Area source', etc.
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
