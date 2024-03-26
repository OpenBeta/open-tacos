import { Metadata } from 'next'
import 'maplibre-gl/dist/maplibre-gl.css'

import '@/public/fonts/fonts.css'
import '../global.css'
import Header from './header'
import { PageFooter } from './components/PageFooter'
import { NextAuthProvider } from '@/components/auth/NextAuthProvider'
import { ReactToastifyProvider } from './components/ReactToastifyProvider'
import { BlockingAlertUploadingInProgress } from './components/ui/GlobalAlerts'
import { OnboardingCheck } from '@/components/auth/OnboardingCheck'

export const metadata: Metadata = {
  title: 'OpenBeta',
  description: 'Free rock climbing platform',
  openGraph: {
    description: 'OpenBeta is a free climbing platform.  Join the community and share your knowledge today.',
    images: '/south-africa-og.jpeg'
  },
  metadataBase: new URL(`https://${process.env.VERCEL_URL ?? 'http://localhost:3000'}`)
}

/**
 * Global layout for the site
 */
export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className='relative'>
        <NextAuthProvider>
          <Header />
          <div>
            {children}
          </div>
          <OnboardingCheck />
        </NextAuthProvider>
        <PageFooter />
        <ReactToastifyProvider />
        <BlockingAlertUploadingInProgress />
      </body>
    </html>
  )
}
