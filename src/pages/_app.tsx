import { ReactElement, useEffect } from 'react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import 'mapbox-gl/dist/mapbox-gl.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useSession, SessionProvider, signIn } from 'next-auth/react'
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast'
import clx from 'classnames'
import { userMediaStore } from '../js/stores/media'

import '../styles/global.css'
import '../../public/fonts/fonts.css'
import useResponsive from '../js/hooks/useResponsive'
import PhotoUploadError from '../components/media/PhotoUploadError'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 250 })

interface AppPropsWithAuth extends AppProps<{ session: any }> {
  Component: AppProps['Component'] & { auth: boolean }
}

export default function MyApp ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuth): JSX.Element {
  const { isMobile } = useResponsive()
  const photoUploadErrorMessage = userMediaStore.use.photoUploadErrorMessage()
  const isPhotoError = photoUploadErrorMessage !== null

  return (
    <>
      <ToastProvider duration={4000}>
        <SessionProvider session={session}>
          {
            Component?.auth
              ? (
                <Auth>
                  <Component {...pageProps} />
                </Auth>
                )
              : (
                <>
                  {isPhotoError && <PhotoUploadError photoUploadErrorMessage={photoUploadErrorMessage} />}
                  <Component {...pageProps} />
                </>
                )
          }
        </SessionProvider>
        <ToastViewport className={clx('fixed p-4 flex flex-col gap-5 z-50', isMobile ? 'top-0 right-0' : 'bottom-0 right-0')} style={{ zIndex: 99999 }} />
      </ToastProvider>
    </>
  )
}

function Auth ({ children }): ReactElement {
  const { status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('auth0')
    }
  }, [])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return children
}
