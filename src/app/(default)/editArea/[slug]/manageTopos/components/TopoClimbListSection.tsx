'use client'
import { AreaType, ClimbType } from '@/js/types'
import { climbLeftRightIndexComparator } from '@/js/utils'
import clx from 'classnames'

import { RouteInfo, highlightRoute, unHighlightRoute } from '@/app/(default)/components/Topo/paperFunctions'

export const TopoClimbListSection: React.FC<{ area: AreaType, activeRoute: RouteInfo | undefined, onClick: Function }> = ({ area, activeRoute, onClick }) => {
  const { climbs, metadata } = area
  const sortedClimbs = [...climbs].sort(climbLeftRightIndexComparator)
  const activeRouteId = activeRoute?.id
  if (!metadata.leaf) return null
  return (
    <section className=' col-span-1'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='flex items-center gap-4'>Climb Selector</h3>
        </div>
      </div>
      <hr className='mt-2 mb-6 border-2 border-base-content' />
      <ol className=''>
        {sortedClimbs.map((climb, index) => {
          return (
            <TopoClimbRow key={climb.id} climb={climb} activeRouteId={activeRouteId} index={index + 1} onClick={onClick} />
          )
        })}
      </ol>
    </section>
  )
}

const TopoClimbRow: React.FC<{ index: number, climb: ClimbType, activeRouteId: string | undefined, onClick: Function }> = ({ climb, index, activeRouteId, onClick }) => {
  return (
    <li id={climb.id} className={clx('w-full btn my-1  flex gap-x-4 flex-nowrap text-start justify-start !h-fit py-2 px-4', activeRouteId === climb.id ? 'btn-accent' : 'bg-gray-200')} onClick={() => { onClick(climb, index) }} onMouseEnter={() => { highlightRoute(climb.id) }} onMouseLeave={() => { unHighlightRoute(climb.id) }}>
      <div className='rounded-full h-6 w-6 grid place-content-center text-sm text-neutral-content bg-neutral flex-shrink-0'>
        {index}
      </div>
      <div className='text-base font-semibold uppercase tracking-tight'>{climb.name}</div>
    </li>
  )
}
