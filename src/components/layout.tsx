import Header from './Header'

interface LayoutProps {
  contentContainerClass?: string
  rootContainerClass?: string
  children?: JSX.Element | JSX.Element[]
  hero?: JSX.Element | JSX.Element[] | null
  showFilterBar?: boolean
  showFooter?: boolean
}

function Layout ({
  contentContainerClass = 'content-fullscreen-tablet',
  rootContainerClass = 'root-container-default',
  children,
  hero = null,
  showFilterBar = true,
  showFooter = true
}: LayoutProps): JSX.Element {
  return (
    <>
      <div className={rootContainerClass}>
        <Header showFilterBar={showFilterBar} />
        {hero}
        <main className={contentContainerClass}>
          {children}
        </main>

        {showFooter
          ? (
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
            )
          : null}

      </div>
    </>
  )
}

export default Layout
