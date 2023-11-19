'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPinLine, Graph, Article, FolderSimplePlus } from '@phosphor-icons/react/dist/ssr'

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
      <ul className='menu w-56'>
        <li>
          <Link href={`/editArea/${slug}/general`} className={classForActivePage('general')}>
            <Article size={24} /> General
          </Link>
        </li>
        <li>
          <Link href={`/editArea/${slug}/location`} className={classForActivePage('location')}>
            <MapPinLine size={24} /> Location
          </Link>
        </li>
        <li>
          <Link href={`/editArea/${slug}/manage`} className={classForActivePage('manage')}>
            <Graph size={24} weight='duotone' /> Manage areas
          </Link>
        </li>
      </ul>

      <div className='p-2 w-56'>
        <Link href={`/editArea/${slug}/attributes`}>
          <button className='btn btn-primary btn-block justify-start'> <FolderSimplePlus size={24} /> Add area</button>
        </Link>
      </div>
    </nav>
  )
}
