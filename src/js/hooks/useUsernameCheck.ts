import { useEffect } from 'react'
import { useRouter as useRouterAppDir, usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useUserProfileCmd from './useUserProfileCmd'

/**
 * A global hook that forces new users to go to the user name screen.
 */
export default function useUsernameCheck (): void {
  const router = useRouter()
  const { data, status } = useSession()
  const { getUsernameById } = useUserProfileCmd({ accessToken: data?.accessToken as string })

  useEffect(() => {
    const uuid = data?.user.metadata.uuid
    if (router.asPath.startsWith('/auth/')) {
      return
    }
    if (status === 'authenticated' && uuid != null) {
      void getUsernameById({ userUuid: uuid }).then(usernameInfo => {
        if (usernameInfo === null) {
          void router.push('/account/changeUsername')
        }
      })
    }
  }, [status])
}

/**
 * A global hook that forces new users to go to the user name screen.  Use this version for pages in the `/app` directory (Next v13).
 */
export function useUsernameCheckAppDir (): void {
  const router = useRouterAppDir()
  const pathname = usePathname()
  const { data, status } = useSession()
  const { getUsernameById } = useUserProfileCmd({ accessToken: data?.accessToken as string })

  useEffect(() => {
    const uuid = data?.user.metadata.uuid
    if (pathname.startsWith('/auth/')) {
      return
    }
    if (status === 'authenticated' && uuid != null) {
      void getUsernameById({ userUuid: uuid }).then(usernameInfo => {
        if (usernameInfo === null) {
          void router.push('/account/changeUsername')
        }
      })
    }
  }, [status])
}
