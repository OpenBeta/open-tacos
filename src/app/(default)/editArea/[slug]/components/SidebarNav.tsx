'use client'
import clx from 'classnames'
import { usePathname } from 'next/navigation'
import { Article, Plus } from '@phosphor-icons/react/dist/ssr'
import { EntityIcon } from '../general/components/AreaItem'
import { AreaAttributesPanel } from './AreaAttributesPanel'

export interface SidebarNavProps {
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
export const SidebarNav: React.FC<SidebarNavProps> = ({ slug, canAddAreas, canAddClimbs, areaCount, climbCount, isLeaf, isBoulder }) => {
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

        <div className='my-6'>
          <AreaAttributesPanel
            canAddAreas={canAddAreas}
            canAddClimbs={canAddClimbs}
            areaCount={areaCount}
            climbCount={climbCount}
            isLeaf={isLeaf}
            isBoulder={isBoulder}
          />
        </div>
      </div>
    </nav>
  )
}
