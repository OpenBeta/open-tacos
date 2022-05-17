import type { AppProps } from 'next/app'
import Router from 'next/router'
import { Auth0Provider } from '@auth0/auth0-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import fetch from 'node-fetch'
import { abortableFetch } from 'abortcontroller-polyfill/dist/cjs-ponyfill'

import '../styles/global.css'
import '../../public/fonts/fonts.css'
import { useEffect, useState } from 'react'

global.fetch = abortableFetch(fetch).fetch

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 500 })

function MyApp ({ Component, pageProps }: AppProps): JSX.Element {
  const [redirectUri, setRedirectUri] = useState<string>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUri(window.location.origin)
    }
  }, [])

  if (redirectUri == null) {
    return null
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={redirectUri}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  )
}

export default MyApp
