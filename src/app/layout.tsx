import '@/public/fonts/fonts.css'
import './global.css'

/**
 * Root layout for the not-found page
 */
export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): any {
  return (
    <html lang='en'>
      <body>
        {children}
      </body>
    </html>
  )
}
