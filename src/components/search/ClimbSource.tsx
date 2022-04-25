import { AutocompleteReshapeSource } from '@algolia/autocomplete-core'
import { AutocompleteSource } from '@algolia/autocomplete-js'

import { MiniCrumbs } from '../ui/BreadCrumbs'

export function reshapeClimbSource (items, sourceObject: AutocompleteReshapeSource<any>): AutocompleteSource<any> | undefined {
  return {
    sourceId: 'climbs',
    ...sourceObject,
    getItems: () => items,
    getItemInputValue: ({ item }) => item.name,
    getItemUrl: ({ item }) => item.climbUUID,

    templates: {
      item: ClimbItem,
      header: ClimbResultHeader
    }
  }
}

const ClimbItem = (props): JSX.Element => {
  console.log(props)
  const { climbName, areaNames } = props.item.document
  return (<div className='my-4 text-xs'><MiniCrumbs pathTokens={areaNames} /><div>{climbName}</div></div>)
}

const ClimbResultHeader = (props: any): JSX.Element => {
  // console.log('#Climb header', props)
  return (<div className='bg-pink-200'>Climb header</div>)
}
