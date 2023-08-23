import Link from 'next/link'
import * as React from 'react'
import { CountByDisciplineType, CountByGradeBandType } from '../../../js/types'
import DisciplineDistribution from '../../crag/disciplineDist'
import MediumHistogram from '../../crag/mediumHistogram'
import TinyHistogram from '../../crag/tinyHistogram'

interface AggregateShape {
  byDiscipline: CountByDisciplineType
  byGradeBand: CountByGradeBandType
}

/** Attributes inherent to the entity being displayed; not atrs to do with
 * rendering / displaying the item.
 */
export interface ListItemEntity {
  /** Where should this item navigate to?
   * methods can be found with getSlug(.metadata.areaId, .metadata.leaf) and
   * similar methods; but any relative or absolute url will do.
   */
  href: string
  id: string
  description: string
  name: string
  totalClimbs: number
  aggregate: AggregateShape
  content: {
    description: string | undefined
  }
}

export interface ListItemProps extends ListItemEntity {
  onFocus: (id: string) => void
  onClick: (id: string) => void
  selected: boolean
  isFav: boolean
}

/** This component by iteself is not generic enough to use in arbitraty accordion
 * use-cases. You'll need to change this to account for overflow rules after the
 * state is expanded.
 */
function Expandable (props: { expand: boolean, children: any }): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null)
  const contentHeight = ref.current !== null ? ref.current?.clientHeight : 0

  return (
    <div
      className='w-full overflow-y-hidden'
      style={{
        maxHeight: props.expand ? `${contentHeight}px` : '0px',
        transition: 'max-height 0.2s ease-in-out'
      }}
    >
      <div ref={ref}>
        {props.children}
      </div>
    </div>
  )
}

export default function ListItem (props: ListItemProps): JSX.Element {
  const { onFocus, onClick, selected, id, name, totalClimbs, href, aggregate } = props
  const gradeDist = [
    aggregate.byGradeBand.beginner,
    aggregate.byGradeBand.intermediate,
    aggregate.byGradeBand.advanced,
    aggregate.byGradeBand.expert
  ]

  return (
    <div
      onClick={() => onClick(id)}
      onMouseEnter={() => onFocus(id)}
      title={selected ? '' : 'Click to Expand'}
      className={`px-6 p-3 rounded-lg border mb-2 cursor-pointer
      ${!selected
        ? 'hover:bg-slate-200 border-gray-600'
      : 'ring-violet-500 shadow-lg shadow-violet-400 border-violet-700'}`}
      id={id}
    >
      <div className='flex flex-wrap items-baseline'>
        <h4 className='w-full flex-1 text-lg font-semibold whitespace-nowrap truncate flex'>
          {name}
          <span className='text-xs p-1'>
            {props.isFav && (<div className=''>❤️</div>)}
          </span>
        </h4>

        <div className='text-xs pr-6'>
          {totalClimbs !== 0 ? totalClimbs : 'No'}{' '}Climbs
        </div>

        <div className=''>
          <TinyHistogram
            data={gradeDist}
            title='Grade distribution for this area. Beginner routes on left and
                  advanced routes on the far right'
          />
        </div>

      </div>

      <Expandable expand={selected}>
        <div className='p-3 flex pt-6'>
          <div className='pr-8'>
            <MediumHistogram
              columnLabels={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
              verticalResolution={8}
              data={gradeDist}
              title='Grade distribution for this area. Beginner routes on left and
                advanced routes on the far right'
            />
          </div>

          <div
            className='w-full h-32'
            title='How many routes of each discipline are logged in this area'
          >
            {aggregate.byDiscipline != null && <DisciplineDistribution data={aggregate.byDiscipline} />}
          </div>
        </div>

        <div className='flex justify-center pt-4'>
          <Link href={href}>
            <button className='border border-slate-600 rounded p-1 px-4'>
              View
            </button>
          </Link>
        </div>
      </Expandable>
    </div>
  )
}
