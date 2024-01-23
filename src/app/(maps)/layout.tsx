import 'mapbox-gl/dist/mapbox-gl.css'
import { Metadata } from 'next'
import '@/public/fonts/fonts.css'
import './../global.css'

/**
 * Root layout for `/maps` route
 */
export default function MapsRootLayout ({
  children
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang='en'>
      <body className='relative'>
        {children}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'OpenBeta climbing maps',
  description: 'Free rock climbing platform',
  openGraph: {
    description: 'OpenBeta is a free climbing platform.  Join the community and share your knowledge today.',
    images: '/south-africa-og.jpeg'
  },
  metadataBase: new URL(`https://${process.env.VERCEL_URL ?? 'http://localhost:3000'}`)
}
