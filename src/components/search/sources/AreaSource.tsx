import { AutocompleteSource } from '@algolia/autocomplete-js'

import { TypesenseDocumentType } from '../../../js/types'
import { areaSearchByName } from '../../../js/typesense/TypesenseClient'
import { wizardActions, wizardStore } from '../../../js/stores/wizards'

export const searchAreas = async (query: string): Promise<AutocompleteSource<TypesenseDocumentType>> => {
  const latlng = wizardStore.addAreaStore.refContextData()
  return {
    sourceId: 'areaSearch',

    getItems: async ({ query }) => await areaSearchByName(query, latlng),

    getItemInputValue: ({ item }): string => {
      return item.areaNames[item.areaNames.length - 1]
    },

    onSelect: ({ item }) => {
      const s = item.areaNames[item.areaNames.length - 1]
      wizardActions.addAreaStore.recordStep2(s, item.climbUUID) // should be area id when ready (https://github.com/OpenBeta/openbeta-graphql/issues/83)
    },

    templates: {
      noResults: () => 'No results',

      item: ({ item }) => {
        return <div>{item.areaNames.join('/')}</div>
      }
    }
  }
}
