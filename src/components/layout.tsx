import Header from './Header'
import Footer from './Footer'

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
              <Footer />
            )
          : null}

      </div>
    </>
  )
}

export default Layout
