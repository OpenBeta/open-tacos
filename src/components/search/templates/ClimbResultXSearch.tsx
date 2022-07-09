import { MiniCrumbs } from '../../ui/BreadCrumbs'
import { TypesenseDocumentType } from '../../../js/types'

interface ItemProps {
  item: TypesenseDocumentType
}

export const ClimbItem = ({ item }: ItemProps): JSX.Element => {
  const { climbName, areaNames } = item
  return (
    <a href={`/climbs/${item.climbUUID}`}>
      <div className='px-2 py-3 text-sm'>
        <MiniCrumbs pathTokens={areaNames} />
        <div className='mt-1'>{climbName}</div>
      </div>
    </a>
  )
}

export const AreaItem = ({ item }: ItemProps): JSX.Element => {
  const { areaNames } = item
  return (
    <div className='my-4 text-xs'>
      <MiniCrumbs pathTokens={areaNames} />
    </div>
  )
}

export const FAItem = ({ item }: ItemProps): JSX.Element => {
  const { climbName, areaNames, fa } = item
  return (
    <div className='my-4 text-xs'>
      <MiniCrumbs pathTokens={areaNames} />
      <div>{climbName}</div>
      <b>{fa}</b>
    </div>
  )
}

interface DefaultHeaderProps {
  items: TypesenseDocumentType[]
}

export const DefaultHeader = ({ items }: DefaultHeaderProps): JSX.Element => {
  return <div className='border-t border-slate-400' />
}

export const DefaultNoResult = (props: any): JSX.Element => {
  return <div>No results for {props.source.sourceId}</div>
}
