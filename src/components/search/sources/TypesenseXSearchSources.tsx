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
  return await Promise.all([{
    sourceId: 'climbs',

    getItems: ({ query }) => rs.climbs,

    getItemInputValue: ({ item }) => {
      return item.climbName
    },

    getItemUrl: ({ item }) => item.climbUUID,

    onSelect ({ item, setQuery, setIsOpen, refresh }) {
      console.log('#onSelect', item)
    },

    onActive ({ item, setQuery, setIsOpen, refresh }) {
      console.log('#onActive', item)
    },

    templates: {
      noResults: DefaultNoResult,
      item: ClimbItem,
      header: DefaultHeader
    }
  },
  {
    sourceId: 'areas',
    getItems: ({ query }) => rs.areas,
    getItemInputValue: ({ item }) => {
      return item.climbUUID
    },
    getItemUrl: ({ item }) => item.climbUUID,
    templates: {
      noResults: DefaultNoResult,
      item: AreaItem,
      header: DefaultHeader
    }
  },
  {
    sourceId: 'fa',
    getItems: ({ query }) => rs.fa,
    getItemInputValue: ({ item }) => {
      return item.fa
    },
    getItemUrl: ({ item }) => item.climbUUID,
    templates: {
      noResults: DefaultNoResult,
      item: FAItem,
      header: DefaultHeader
    }
  }
  ])
}
