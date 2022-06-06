import type { AppProps } from 'next/app'
import Router from 'next/router'
import 'mapbox-gl/dist/mapbox-gl.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useSession, SessionProvider } from 'next-auth/react'
import { ReactElement } from 'react'

import '../styles/global.css'
import '../../public/fonts/fonts.css'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 250 })

interface AppPropsWithAuth extends AppProps {
  Component: AppProps['Component'] & { auth: boolean }
}

export default function MyApp ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuth): JSX.Element {
  return (
    <SessionProvider session={session}>
      {
        Component?.auth
          ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
            )
          : (
            <Component {...pageProps} />
            )
      }
    </SessionProvider>
  )
}

function Auth ({ children }): ReactElement {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return children
}
