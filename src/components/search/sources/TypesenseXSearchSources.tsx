import { AutocompleteSource } from '@algolia/autocomplete-js'

import { multiSearch } from '../../../js/typesense/TypesenseClient'
import { DefaultHeader, DefaultNoResult, ClimbItem, AreaItem, FAItem } from '../templates/ClimbResultXSearch'
import { TypesenseDocumentType } from '../../../js/types'

/**
 * Call Typesense multi-sources search API and wrap the result in an array of Algolia.Source objects which contains matching climbs, areas, fa.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * @param query search string
 * @see TypesenseClient.multiSearch()
 */

export const xsearchTypesense = async (query: string): Promise<Array<AutocompleteSource<TypesenseDocumentType>>> => {
  const rs = await multiSearch(query)
  return [{
    sourceId: 'Climbs',
    getItems: ({ query }) => rs.climbs,
    getItemInputValue: ({ item }) => {
      return item.climbName
    },
    getItemUrl: ({ item }) => `/climbs/${item.climbUUID}`,
    templates: {
      noResults: DefaultNoResult,
      item: ClimbItem,
      header: DefaultHeader
    }
  },
  {
    sourceId: 'Areas',
    getItems: ({ query }) => rs.areas,
    getItemInputValue: ({ item }) => {
      return item.areaNames[item.areaNames.length - 1]
    },
    getItemUrl: ({ item }) => `/climbs/${item.climbUUID}`,
    templates: {
      noResults: DefaultNoResult,
      item: AreaItem,
      header: DefaultHeader
    }
  },
  {
    sourceId: 'FA',
    getItems: ({ query }) => rs.fa,
    getItemInputValue: ({ item }) => {
      return item.fa
    },
    getItemUrl: ({ item }) => `/climbs/${item.climbUUID}`,
    templates: {
      noResults: DefaultNoResult,
      item: FAItem,
      header: DefaultHeader
    }
  }
  ]
}
