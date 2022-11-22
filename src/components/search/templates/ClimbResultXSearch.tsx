import { TextOnlyCrumbs } from '../../ui/BreadCrumbs'
import { TypesenseDocumentType, TypesenseAreaType } from '../../../js/types'

interface ItemProps {
  item: TypesenseDocumentType
}

export const ClimbItem = ({ item }: ItemProps): JSX.Element => {
  const { climbName, areaNames } = item
  return (
    <div className='px-2 py-3'>
      <div className='text-xs'>
        <TextOnlyCrumbs pathTokens={areaNames} highlightIndices={[]} />
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
  )
}

interface AreaItemProps {
  item: TypesenseAreaType
}
export const AreaItem = ({ item }: AreaItemProps): JSX.Element => {
  const { pathTokens, highlightIndices, name } = item
  return (
    <div className='py-4 text-xs flex flex-col gap-2'>
      {pathTokens.length === 1 &&
        <>
          <div className='badge badge-success bg-opacity-50 badge-sm'>country</div>
          <div className='badge badge-outline badge-lg'>{name} →</div>
        </>}
      {pathTokens.length > 1 &&
        <>
          <div className='badge badge-info badge-sm'>area</div>
          <TextOnlyCrumbs pathTokens={pathTokens} highlightIndices={highlightIndices} />
        </>}
    </div>
  )
}

export const FAItem = ({ item }: ItemProps): JSX.Element => {
  const { climbName, areaNames, fa } = item
  return (
    <a className='py-4 text-xs' href={`/climbs/${item.climbUUID}`}>
      <TextOnlyCrumbs pathTokens={areaNames} highlightIndices={[]} />
      <div>
        Route: <b>{climbName}</b>
      </div>
      <div>
        First Ascent: <b>{fa}</b>
      </div>
    </a>
  )
}

interface DefaultHeaderProps {
  items: TypesenseDocumentType[] | TypesenseAreaType[]
  source?: any
  state?: any
}

export const DefaultHeader = ({ source, ...props }: DefaultHeaderProps): JSX.Element => {
  return <h2 className='border-b pt-4' id={source?.sourceId}>{source?.sourceId}</h2>
}

export const DefaultNoResult = (props: any): JSX.Element => {
  return <div>No results for {props.source.sourceId}</div>
}
