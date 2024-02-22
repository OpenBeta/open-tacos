'use client'
import clx from 'classnames'
import { usePathname } from 'next/navigation'
import { Article, Plus } from '@phosphor-icons/react/dist/ssr'
import { EntityIcon, AreaIcon, EType } from './general/components/AreaItem'

interface Props {
  slug: string
  canAddAreas: boolean
  canAddClimbs: boolean
  areaCount: number
  climbCount: number
  isLeaf: boolean
  isBoulder: boolean
}
/**
 * Sidebar navigation for area edit
 */
export const SidebarNav: React.FC<Props> = ({ slug, canAddAreas, canAddClimbs, areaCount, climbCount, isLeaf, isBoulder }) => {
  const activePath = usePathname()
  /**
   * Disable menu item's hover/click when own page is showing
   */
  const classForActivePage = (myPath: string): string => activePath.endsWith(myPath) ? 'font-bold pointer-events-none' : 'font-base'
  return (
    <nav className='px-6'>
      <div className='sticky top-16'>
        <ul className='menu w-56 px-0'>
          <li>
            <a href={`/editArea/${slug}/general`} className={classForActivePage('general')}>
              <Article size={24} /> General
            </a>
          </li>
          <li>
            <a
              href={`/editArea/${slug}/manageClimbs`}
              className={clx(
                classForActivePage('manageClimbs')
              )}
            >
              <EntityIcon type='climb' withLabel={false} size={24} /> Manage climbs
            </a>
          </li>
          <li>
            <a
              href={`/editArea/${slug}/manageAreas`}
              className={clx(
                classForActivePage('manageAreas')
              )}
            >
              <EntityIcon type='area' withLabel={false} size={24} /> Manage areas
            </a>
          </li>
          <li>
            <a
              href={`/editArea/${slug}/manageTopos`}
              className={clx(
                classForActivePage('manageTopos')
              )}
            >
              <EntityIcon type='topo' withLabel={false} size={24} /> Manage topos
            </a>
          </li>
        </ul>

        <div className='w-56 my-4'>
          <hr className='border-t my-2' />
          <a
            href={`/editArea/${slug}/general#addArea`}
            className={clx(canAddAreas ? '' : 'cursor-not-allowed pointer-events-none', 'block py-2')}
          >
            <button disabled={!canAddAreas} className='btn btn-accent btn-outline btn-block justify-start'>
              <Plus size={20} weight='bold' /> Add areas
            </button>
          </a>

          <a
            href={`/editArea/${slug}/manageClimbs`}
            className={clx(canAddClimbs ? '' : 'cursor-not-allowed pointer-events-none', 'block py-2')}
          >
            <button disabled={!canAddClimbs} className='btn btn-accent btn-outline btn-block justify-start'>
              <Plus size={20} weight='bold' /> Add climbs
            </button>
          </a>

          <hr className='border-t my-2' />

        </div>

        <Summary
          canAddAreas={canAddAreas}
          canAddClimbs={canAddClimbs}
          areaCount={areaCount}
          climbCount={climbCount}
          isLeaf={isLeaf}
          isBoulder={isBoulder}
        />
      </div>
    </nav>
  )
}

const Summary: React.FC<Omit<Props, 'slug'>> = ({ canAddAreas, canAddClimbs, areaCount, climbCount, isLeaf, isBoulder }) => {
  let type: EType
  if (isLeaf) {
    type = isBoulder ? 'boulder' : 'crag'
  } else {
    type = 'area'
  }
  return (
    <section>

      <p className='pl-4 pb-1 font-semibold text-secondary text-sm uppercase'>Area attributes</p>

      <div className='bg-base-100 rounded-box px-4'>
        <div className='flex flex-col gap-3 py-3 text-base-300 text-xs w-full '>

          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Entity type</span> <span className='text-primary font-semibold'><EntityIcon type={type} size={16} /></span>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Crag</span> <span className='text-primary font-semibold'>{isLeaf ? 'YES' : 'NO'}</span>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Boulder</span> <span className='text-primary font-semibold'>{isBoulder ? 'YES' : 'NO'}</span>
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
            <span className='text-scondary'>Can add areas?</span> <span className='text-primary font-semibold'>{booleanToYesNo(canAddAreas)}</span>
          </div>
          <div className='flex items-center gap-2 justify-between'>
            <span className='text-scondary'>Climbs</span> <span className='text-primary font-semibold'>{booleanToYesNo(canAddClimbs)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
const booleanToYesNo = (bool: boolean): string => bool ? 'YES' : 'NO'
