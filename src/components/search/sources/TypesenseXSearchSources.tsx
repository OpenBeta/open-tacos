import { AutocompleteSource } from '@algolia/autocomplete-js'
import { multiSearch, MultisearchReturnType } from '../../../js/typesense/TypesenseClient'
import { DefaultHeader, DefaultNoResult, ClimbItem, AreaItem, FAItem } from '../templates/ClimbResultXSearch'
import { TypesenseDocumentType, TypesenseAreaType, EntityType } from '../../../js/types'

export type OnSelectType = (props: TypesenseDocumentType | TypesenseAreaType) => void
/**
 * Call Typesense multi-sources search API and wrap the result in an array of Algolia.Source objects which contains matching climbs, areas, fa.
 * See also https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/
 * @param query search string
 * @param faSearch true | false For media tagging we set this to false to simplify the search results
 * @see TypesenseClient.multiSearch()
 */
export const xsearchTypesense = async (query: string, onSelect?: OnSelectType, faSearch: boolean = true): Promise<Array<AutocompleteSource<TypesenseDocumentType | TypesenseAreaType>>> => {
  const rs = await multiSearch(query)

  const climbs: AutocompleteSource<TypesenseDocumentType> = {
    sourceId: 'Climbs',
    getItems: ({ query }) => rs.climbs,
    getItemInputValue: ({ item }) => {
      return item.climbName
    },
    getItemUrl: entityToUrl,
    onSelect: ({ item, setIsOpen, itemUrl }) => {
      if (onSelect != null) {
        setIsOpen(false)
        onSelect(item)
      } else {
        if (itemUrl != null) {
          location.href = itemUrl
        }
      }
    },
    templates: {
      noResults: DefaultNoResult,
      item: ClimbItem,
      header: DefaultHeader
    }
  }

  const areas: AutocompleteSource<TypesenseAreaType> = {
    sourceId: 'Areas',
    getItems: ({ query }) => rs.areas,
    getItemInputValue: ({ item }) => {
      return item.name
    },
    getItemUrl: entityToUrl,
    onSelect: ({ item, itemUrl, setIsOpen }) => {
      if (onSelect != null) {
        setIsOpen(false)
        onSelect(item)
      } else {
        if (itemUrl != null) {
          location.href = itemUrl
        }
      }
    },
    templates: {
      noResults: DefaultNoResult,
      item: AreaItem,
      header: DefaultHeader
    }
  }

  const sources = [climbs, areas]

  if (faSearch) { // don't include FA source
    sources.push(makeFASource(rs))
  }

  // @ts-expect-error
  return sources
}

const makeFASource = (rs: MultisearchReturnType): AutocompleteSource<TypesenseDocumentType> => ({
  sourceId: 'FA',
  getItems: ({ query }) => rs.fa,
  getItemInputValue: ({ item }) => {
    return item.fa
  },
  getItemUrl: entityToUrl,
  templates: {
    noResults: DefaultNoResult,
    item: FAItem,
    header: DefaultHeader
  }
})

/**
 * Typesense result item => OpenBeta entity URL
 */
const entityToUrl = ({ item }: {item: TypesenseAreaType | TypesenseDocumentType}): string | undefined => {
  const { type } = item
  switch (type) {
    case EntityType.area:
      return `/crag/${(item as TypesenseAreaType).id}`
    case EntityType.crag:
      return `/crag/${(item as TypesenseAreaType).id}`
    case EntityType.climb:
      return `/climbs/${(item as TypesenseDocumentType).climbUUID}`
    default: return undefined
  }
}
