import type { AppProps } from 'next/app'
import fetch from 'node-fetch'
import { abortableFetch } from 'abortcontroller-polyfill/dist/cjs-ponyfill'

import '../styles/global.css'
import '../../public/fonts/fonts.css'

global.fetch = abortableFetch(fetch).fetch

function MyApp ({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />
}

export default MyApp
