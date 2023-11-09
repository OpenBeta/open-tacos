import Link from 'next/link'
import { MapPinLine, TreeStructure, Article } from '@phosphor-icons/react/dist/ssr'

export const SidebarNav: React.FC<{ slug: string }> = ({ slug }) => {
  return (
    <nav className='px-6'>
      <ul className='menu w-56'>
        <li>
          <Link href={`/editArea/${slug}`}>
            <Article size={24} /> General
          </Link>
        </li>
        <li>
          <Link href={`/editArea/${slug}/attributes`}>
            <MapPinLine size={24} /> Location
          </Link>
        </li>
        <li>
          <Link href={`/editArea/${slug}/attributes`}>
            <TreeStructure size={24} className='rotate-90' /> Child areas
          </Link>
        </li>
      </ul>
    </nav>
  )
}
