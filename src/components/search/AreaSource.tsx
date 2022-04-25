import { AutocompleteReshapeSource } from '@algolia/autocomplete-core'
import { AutocompleteSource } from '@algolia/autocomplete-js'

import { MiniCrumbs } from '../ui/BreadCrumbs'

export function reshapeAreaSource (items, sourceObject: AutocompleteReshapeSource<any>): AutocompleteSource<any> | undefined {
  return {
    sourceId: 'areas',
    ...sourceObject,
    getItems: () => items,
    getItemInputValue: ({ item }) => item.name,
    getItemUrl: ({ item }) => item.climbUUID,

    templates: {
      item: ItemRenderer,
      header: ClimbResultHeader
    }
  }
}

const ItemRenderer = (props): JSX.Element => {
  console.log(props)
  const { areaNames } = props.item.document
  return (<div className='my-4 text-xs'><MiniCrumbs pathTokens={areaNames} /></div>)
}
const ClimbResultHeader = (props): JSX.Element => {
  return (<div className='bg-pink-200'>Area header</div>)
}
