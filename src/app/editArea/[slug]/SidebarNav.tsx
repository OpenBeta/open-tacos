'use client'
import Link from 'next/link'
import clx from 'classnames'
import { usePathname } from 'next/navigation'
import { Article, Plus } from '@phosphor-icons/react/dist/ssr'

/**
 * Sidebar navigation for area edit
 */
export const SidebarNav: React.FC<{ slug: string, canAddAreas: boolean, canAddClimbs: boolean }> = ({ slug, canAddAreas, canAddClimbs }) => {
  const activePath = usePathname()
  /**
   * Disable menu item's hover/click when own page is showing
   */
  const classForActivePage = (myPath: string): string => activePath.endsWith(myPath) ? 'font-semibold pointer-events-none' : ''
  return (
    <nav className='px-6'>
      <div className='sticky top-16'>
        <ul className='menu w-56 px-0'>
          <li>
            <Link href={`/editArea/${slug}/general`} className={classForActivePage('general')}>
              <Article size={24} /> General
            </Link>
          </li>
        </ul>

        <div className='w-56 mt-4'>
          <hr className='border-t my-2' />
          <Link href={`/editArea/${slug}/general#addArea`} className={clx(canAddAreas ? '' : 'cursor-not-allowed pointer-events-none', 'block py-2')}>
            <button disabled={!canAddAreas} className='btn btn-accent btn-block justify-start'>
              <Plus size={20} weight='bold' /> Add area
            </button>
          </Link>

          <div className={clx(canAddAreas ? '' : 'cursor-not-allowed pointer-events-none', 'block py-1')}>
            <div className='text-sm italic text-secondary'>Coming soon:</div>
            <button disabled={!canAddClimbs} className='btn btn-accent btn-block justify-start'>
              <Plus size={20} weight='bold' /> Add climb
            </button>
          </div>

          <hr className='border-t my-2' />

        </div>
      </div>
    </nav>
  )
}
