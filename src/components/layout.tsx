import React from 'react'
import Header from './Header'
import Head from 'next/head'
import SeoTags from '../components/SeoTags'

interface LayoutProps {
  contentContainerClass?: string
  rootContainerClass?: string
  children?: JSX.Element | JSX.Element[]
  hero?: JSX.Element | JSX.Element[] | null
  showFilterBar?: boolean
}
function Layout ({ contentContainerClass = 'content-fullscreen-tablet', rootContainerClass = 'root-container-default', children, hero = null, showFilterBar = true }: LayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Climbing Route Catalog</title>
        <meta name='description' content='Open license climbing route catalog' />
        <link rel='icon' href='/favicon.ico' />

        <SeoTags
          keywords={['openbeta', 'rock climbing', 'climbing api']}
          description='Climbing route catalog'
          title='Home'
        />
      </Head>

      <div className={rootContainerClass}>
        <Header showFilterBar={showFilterBar} />
        {hero}
        <main className={contentContainerClass}>
          {children}
        </main>

        <footer className='bg-contrast text-primary'>
          <nav className='flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8'>
            <p className=''>
              A project by {' '}
              <a
                className='font-semibold no-underline'
                href='https://openbeta.io'
                target='_blank'
                rel='noopener noreferrer'
              >
                OpenBeta
              </a>
            </p>

            <p>
              <a
                className='font-semibold no-underline'
                href='https://github.com/OpenBeta/open-tacos'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub
              </a>
            </p>
          </nav>
        </footer>
      </div>
    </>
  )
}

export default Layout
