import { AutocompleteReshapeSource } from '@algolia/autocomplete-core'
import { AutocompleteSource } from '@algolia/autocomplete-js'

import { MiniCrumbs } from '../../ui/BreadCrumbs'

export function reshapeFASource (items, sourceObject: AutocompleteReshapeSource<any>): AutocompleteSource<any> | undefined {
  return {
    ...sourceObject,
    sourceId: 'fa',
    getItems: () => items,
    getItemInputValue: ({ item }) => item.name,
    getItemUrl: ({ item }) => item.climbUUID,

    templates: {
      item: ItemRenderer,
      header: ResultHeader
    }
  }
}

const ItemRenderer = (props): JSX.Element => {
  const { climbName, areaNames, fa } = props.item.document
  return (<div className='my-4 text-xs'><MiniCrumbs pathTokens={areaNames} /><div>{climbName}</div><b>{fa}</b></div>)
}
const ResultHeader = (props: any): JSX.Element => {
  return (<div className='bg-blue-200'>FA header</div>)
}
