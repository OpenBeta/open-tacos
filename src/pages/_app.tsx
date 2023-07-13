import { ReactElement, useEffect } from 'react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import 'mapbox-gl/dist/mapbox-gl.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useSession, SessionProvider, signIn } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import '../styles/global.css'
import '../../public/fonts/fonts.css'
import useResponsive from '../js/hooks/useResponsive'
import useUsernameCheck from '../js/hooks/useUsernameCheck'
import { useUserGalleryStore } from '../js/stores/useUserGalleryStore'
import { BlockingAlert } from '../components/ui/micro/AlertDialogue'
import { XMarkIcon } from '@heroicons/react/24/outline'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 250 })

interface AppPropsWithAuth extends AppProps<{ session: any }> {
  Component: AppProps['Component'] & { auth: boolean }
}

export default function MyApp ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuth): JSX.Element {
  const uploading = useUserGalleryStore(store => store.uploading)
  return (
    <>
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
                  <Component {...pageProps} />
                </>
                )
          }
        <NewUserCheck />
      </SessionProvider>
      <ToastContainer
        position='bottom-right'
        autoClose={6000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme='light'
        closeButton={ToastCloseButton}
      />
      {uploading &&
        <BlockingAlert
          title='Uploading'
          description={<progress className='progress w-56' />}
        />}
      {/* main call-to-action popup */}
      {/* <MainCta /> */}
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

/**
 * A wrapper component so that we can call the username check hook
 * inside SessionProvider.
 */
const NewUserCheck: React.FC = () => {
  useUsernameCheck()
  return null
}

const ToastCloseButton: React.FC<any> = ({ closeToast }) => (
  <button className='self-center btn btn-square btn-outline' onClick={closeToast}>
    <XMarkIcon
      className='w-8 h-8'
      onClick={closeToast}
    />
  </button>
)
