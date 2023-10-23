import '../../public/fonts/fonts.css'
import './global.css'
import Header from './header'
import Footer from './footer'
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
        </NextAuthProvider>
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
