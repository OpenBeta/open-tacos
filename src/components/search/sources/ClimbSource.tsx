import { AutocompleteReshapeSource } from '@algolia/autocomplete-core'
import { AutocompleteSource } from '@algolia/autocomplete-js'

export function reshapeClimbSource (items, sourceObject: AutocompleteReshapeSource<any>, itemTemplate, itemHeader): AutocompleteSource<any> {
  return {
    ...sourceObject,
    sourceId: 'climbs',
    getItems: () => items,
    onSelect ({ item, setQuery, setIsOpen, refresh }) {
      console.log('#onSelect', item)
    },

    onActive ({ item, setQuery, setIsOpen, refresh }) {
      console.log('#onActive', item)
    },

    getItemInputValue: ({ item }) => {
      return item.document.climbName
    },
    getItemUrl: ({ item }) => item.climbUUID,
    templates: {
      item: itemTemplate,
      header: itemHeader
    }
  }
}
