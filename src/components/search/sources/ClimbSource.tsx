import { AutocompleteReshapeSource } from '@algolia/autocomplete-core'
import { AutocompleteSource } from '@algolia/autocomplete-js'

export function reshapeClimbSource (items, sourceObject: AutocompleteReshapeSource<any>, itemTemplate, itemHeader): AutocompleteSource<any> {
  return {
    ...sourceObject,
    sourceId: 'climbs',
    getItems: () => items,
    getItemInputValue: ({ item }) => item.name,
    getItemUrl: ({ item }) => item.climbUUID,

    templates: {
      item: itemTemplate,
      header: itemHeader
    }
  }
}
