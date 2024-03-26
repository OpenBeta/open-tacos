import Link from 'next/link'
import { Metadata } from 'next'

import { Chat, House, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { Logo } from './(default)/header'
import { XSearchMinimal } from '@/components/search/XSearch'
import Alien from '@/assets/illustrations/alien-2-89'

export const metadata: Metadata = {
  title: '404 Page not found - OpenBeta'
}

/**
 * Global 404 page
 */
export default function NotFound (): any {
  return (
    <div className='narrow-page-margins'>
      <header className='py-6'>
        <Logo withText />
      </header>

      <main className='mt-8'>
        <div className='flex items-center gap-16'>
          <div className='flex flex-col gap-6 max-w-md'>
            <h1 className='text-6xl text-secondary tracking-tight font-bold'>Oops!</h1>
            <h2 className='text-xl font-normal'>We can't seem to find the page you're looking for.</h2>
            <p className='text-sm'>Error code: 404</p>

            <div>
              <p className='text-sm font-light'>Some helpful links:</p>
              <ul className='menu'>
                <li className='hover:bg-transparent'><XSearchMinimal /></li>
                <li>
                  <a className='link link-hover text-sm' href={process.env.NEXT_PUBLIC_DISCORD_INVITE}><Chat />Discord community</a>
                </li>
                <li>
                  <a className='link link-hover text-sm' href='https://github.com/OpenBeta/open-tacos/issues'><GithubLogo />GitHub issues</a>
                </li>
                <li>
                  <Link href='/' className='link link-hover text-sm'><House /> Home</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='hidden md:block'>
            <Alien className='w-80 fill-slate-200/50' />
          </div>
        </div>
      </main>
    </div>
  )
}
