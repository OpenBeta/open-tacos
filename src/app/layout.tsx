import { Metadata } from 'next'
import '../../public/fonts/fonts.css'
import './global.css'
import Header from './header'
import { PageFooter } from './components/PageFooter'
import { NextAuthProvider } from './components/NextAuthProvider'

export const metadata: Metadata = {
  title: 'OpenBeta',
  description: 'Free rock climbing platform',
  openGraph: {
    description: 'OpenBeta is a free climbing platform.  Join the community and share your knowledge today.',
    images: '/south-africa-og.jpeg'
  }
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
