import '../../public/fonts/fonts.css'
import './global.css'
import Header from './header'
import { PageFooter } from './components/PageFooter'
import { NextAuthProvider } from './components/NextAuthProvider'

export const metadata = {
  title: 'OpenBeta',
  description: 'Free rock climbing catalog'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang='en'>
      <body className='mx-auto'>
        <NextAuthProvider>
          <Header />
          <div>
            {children}
          </div>
        </NextAuthProvider>
        <PageFooter />
      </body>
    </html>
  )
}
