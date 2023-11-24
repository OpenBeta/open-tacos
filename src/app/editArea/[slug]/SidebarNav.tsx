'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Article, FolderSimplePlus } from '@phosphor-icons/react/dist/ssr'

/**
 * Sidebar navigation for area edit
 */
export const SidebarNav: React.FC<{ slug: string }> = ({ slug }) => {
  const activePath = usePathname()
  /**
   * Disable menu item's hover/click when own page is showing
   */
  const classForActivePage = (myPath: string): string => activePath.endsWith(myPath) ? 'bg-base-300/60 pointer-events-none' : ''
  return (
    <nav className='px-6'>
      <div className='sticky top-0'>
        <ul className='menu w-56'>
          <li>
            <Link href={`/editArea/${slug}/general`} className={classForActivePage('general')}>
              <Article size={24} /> General
            </Link>
          </li>
        </ul>

        <div className='p-2 w-56 mt-4'>
          <hr className='border-t' />
          <Link href={`/editArea/${slug}/general#addArea`} className='block py-4'>
            <button className='btn btn-primary btn-block justify-start'> <FolderSimplePlus size={24} /> Add area</button>
          </Link>

          <hr className='border-t' />

        </div>
      </div>
    </nav>
  )
}
