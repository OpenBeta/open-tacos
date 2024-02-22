'use client'
import { EntityIcon, EType } from '../general/components/AreaItem'
import { SidebarNavProps } from './SidebarNav'

/**
 * Show area attributes in a small panel
 */
export const AreaAttributesPanel: React.FC<Omit<SidebarNavProps, 'slug'>> = ({ canAddAreas, canAddClimbs, areaCount, climbCount, isLeaf, isBoulder }) => {
  let type: EType
  if (isLeaf) {
    type = isBoulder ? 'boulder' : 'crag'
  } else {
    type = 'area'
  }
  return (
    <section>
      <p className='pl-4 pb-1 font-semibold text-secondary text-sm uppercase'>Area attributes</p>

      <div className='bg-base-100 rounded-box border p-4'>
        <div className='flex flex-col gap-3 text-base-300 text-xs w-full '>

          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Entity type</span> <span className='text-primary font-semibold'><EntityIcon type={type} size={16} /></span>
          </div>

          <hr />

          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Crag</span> <span className='text-primary font-semibold'>{booleanToYesNo(isLeaf)}</span>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Boulder</span> <span className='text-primary font-semibold'>{booleanToYesNo(isBoulder)}</span>
          </div>

          <hr />

          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Child areas</span> <span className='text-primary font-semibold'>{areaCount}</span>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Climbs</span> <span className='text-primary font-semibold'>{climbCount}</span>
          </div>

          <hr />

          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Can add child areas?</span> <span className='text-primary font-semibold'>{booleanToYesNo(canAddAreas)}</span>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Can add climbs?</span> <span className='text-primary font-semibold'>{booleanToYesNo(canAddClimbs)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const booleanToYesNo = (bool: boolean): string => bool ? 'YES' : 'NO'
