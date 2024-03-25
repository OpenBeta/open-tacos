import Link from 'next/link'
import { Chat, House } from '@phosphor-icons/react/dist/ssr'
import { XSearchMinimal } from '@/components/search/XSearch'

export default function NotFound (): any {
  return (
    <div className='mt-16 default-page-margins h-[60vh]'>
      <div className='alert lg:px-16 py-16'>
        <div>
          <p className='text-lg'>The page you're looking for is not found.</p>
          <p className='mt-4 text-secondary'>May we suggest some options:</p>
          <ul className='menu'>
            <li className='hover:bg-transparent'><XSearchMinimal /></li>
            <li>
              <a className='link link-hover text-sm' href={process.env.NEXT_PUBLIC_DISCORD_INVITE}><Chat /> Join our Discord community</a>
            </li>
            <li>
              <Link href='/' className='link link-hover text-sm'><House /> Return Home</Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
