'use client'
import clx from 'classnames'
import { usePathname } from 'next/navigation'
import { Article, Plus, LineSegments } from '@phosphor-icons/react/dist/ssr'

/**
 * Sidebar navigation for area edit
 */
export const SidebarNav: React.FC<{ slug: string, canAddAreas: boolean, canAddClimbs: boolean }> = ({ slug, canAddAreas, canAddClimbs }) => {
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
              <LineSegments size={24} /> Manage climbs
            </a>
          </li>
        </ul>

        <div className='w-56 mt-4'>
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
            className={clx(canAddClimbs ? '' : 'cursor-not-allowed pointer-events-none', 'block py-1')}
          >
            <button disabled={!canAddClimbs} className='btn btn-accent btn-outline btn-block justify-start'>
              <Plus size={20} weight='bold' /> Add climbs
            </button>
          </a>

          <hr className='border-t my-2' />

        </div>
      </div>
    </nav>
  )
}
