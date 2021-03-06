import { MiniCrumbs } from '../../ui/BreadCrumbs'
import { TypesenseDocumentType } from '../../../js/types'

interface ItemProps {
  item: TypesenseDocumentType
}

export const ClimbItem = ({ item }: ItemProps): JSX.Element => {
  const { climbName, areaNames } = item
  return (
    <a href={`/climbs/${item.climbUUID}`}>
      <div className='px-2 py-3'>
        <div className='text-xs'>
          <MiniCrumbs pathTokens={areaNames} />
        </div>

        <div className='pt-1 text-sm flex flex-wrap items-center'>
          <div className='flex-1 my-1'>
            <div className='text-base whitespace-nowrap'>{climbName}</div>
          </div>

          <div className='flex-1 flex justify-end whitespace-nowrap'>
            <div className='rounded-full p-1 px-3 bg-indigo-700 text-white text-xs
              flex justify-center items-center mr-2'
            >
              {item.areaNames[item.areaNames.length - 1]}
            </div>

            <div className='rounded-full p-1 px-3 bg-slate-700 text-white text-xs
              flex justify-center items-center mr-2'
            >
              {item.grade}
            </div>

            <div className='rounded-full p-1 px-3 bg-violet-700 text-white text-xs
              flex justify-center items-center'
            >
              {item.disciplines.join(', ')}
            </div>
          </div>

        </div>
      </div>
    </a>
  )
}

export const AreaItem = ({ item }: ItemProps): JSX.Element => {
  const { areaNames } = item
  return (
    <a href={`/climbs/${item.climbUUID}`}>
      <div className='my-4 text-xs'>
        <MiniCrumbs pathTokens={areaNames} />
      </div>
    </a>
  )
}

export const FAItem = ({ item }: ItemProps): JSX.Element => {
  const { climbName, areaNames, fa } = item
  return (
    <a href={`/climbs/${item.climbUUID}`}>
      <div className='my-4 text-xs'>
        <MiniCrumbs pathTokens={areaNames} />
        <div>
          Route: <b>{climbName}</b>
        </div>

        <div>
          First Ascent: <b>{fa}</b>
        </div>
      </div>
    </a>
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
