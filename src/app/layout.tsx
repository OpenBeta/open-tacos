import '@/public/fonts/fonts.css'
import './global.css'
import PostHogProvider from '@/components/analytics/PostHogProvider'

/**
 * Root layout for the not-found page
 */
export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className='relative'>
        <PostHogProvider />
        {children}
      </body>
    </html>
  )
}
