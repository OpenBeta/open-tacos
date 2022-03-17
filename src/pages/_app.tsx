import type { AppProps } from 'next/app'
import Router from 'next/router'
import {
  ApolloProvider
} from '@apollo/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import fetch from 'node-fetch'
import { abortableFetch } from 'abortcontroller-polyfill/dist/cjs-ponyfill'

import { graphqlClient } from '../js/graphql/Client'
import '../styles/global.css'
import '../../public/fonts/fonts.css'

global.fetch = abortableFetch(fetch).fetch

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 500 })

function MyApp ({ Component, pageProps }: AppProps): JSX.Element {
  return <ApolloProvider client={graphqlClient}><Component {...pageProps} /></ApolloProvider>
}

export default MyApp
