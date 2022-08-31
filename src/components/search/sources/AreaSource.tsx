import { AutocompleteSource } from '@algolia/autocomplete-js'

// import { TypesenseDocumentType } from '../../../js/types'
import { areaSearchByName } from '../../../js/typesense/TypesenseClient'
// import { wizardActions, wizardStore } from '../../../js/stores/wizards'
import { QueryProps } from '../AreaSearch'

export const searchAreas = async (searchQuery: QueryProps, onSelect): Promise<AutocompleteSource<any>> => {
  // const latlng = wizardStore.addAreaStore.refContextData()
  return {
    sourceId: 'areaSearch',

    getItems: async ({ query }) => await areaSearchByName(query, searchQuery.data.latlng),

    getItemInputValue: ({ item }): string => {
      return item.name
    },

    onSelect: ({ item }): void => {
      if (onSelect != null) {
        onSelect(item)
      }
    },
    //   // wizardActions.addAreaStore.recordStep2(item.name, item.areaUUID) // should be area id when ready (https://github.com/OpenBeta/openbeta-graphql/issues/83)
    // },

    templates: {
      noResults: () => 'No results',

      item: ({ item }) => {
        return (
          <div>
            <div>{item.name}</div>
            <div className='px-4 text-base-300 breadcrumbs text-sm'>
              <ul className='flex-wrap'>
                {item.pathTokens.map((token: string, idx: number) => (<li key={idx}>{token}</li>))}
              </ul>
            </div>
          </div>
        )
      }
    }
  }
}
