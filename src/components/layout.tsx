import React from 'react'
import Header from './header'
import Head from 'next/head'
import SeoTags from '../components/SeoTags'

interface LayoutProps {
  layoutClz?: string
  customClz?: string
  children?: JSX.Element
  headerImage?: JSX.Element
}
function Layout ({ layoutClz = 'layout-default', customClz = '', children, headerImage }: LayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Climbing Route Catalog</title>
        <meta name='description' content='Open license climbing route catalog' />
        <link rel='icon' href='/favicon.ico' />
        <link
          href='/fonts/fonts.css'
          rel='stylesheet'
        />
        <SeoTags
          keywords={['openbeta', 'rock climbing', 'climbing api']}
          description='Climbing route catalog'
          title='Home'
        />
      </Head>

      <div className={`main-container ${customClz}`}>
        <Header />

        {headerImage !== undefined && headerImage}

        <main className={layoutClz}>{children}</main>

        <footer className='mt-8 bg-custom-green'>
          <nav className='flex justify-between max-w-4xl p-4 mx-auto text-sm md:p-8'>
            <p className='text-white'>
              A project by {' '}
              <a
                className='font-bold no-underline'
                href='https://openbeta.io'
                target='_blank'
                rel='noopener noreferrer'
              >
                OpenBeta
              </a>
            </p>

            <p>
              <a
                className='font-bold text-white no-underline'
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
