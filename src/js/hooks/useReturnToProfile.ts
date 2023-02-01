import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

interface ReturnToProfileHook {
  toMyProfile: () => Promise<void>
}

/**
 * A React hook used to send the signed-in user to their profile page
 * if they're on a different page
 */
export default function useReturnToProfile (): ReturnToProfileHook {
  const router = useRouter()
  const { data } = useSession()

  const nick = data?.user?.metadata?.nick ?? null

  const toMyProfile = async (): Promise<void> => {
    if (nick != null && router.asPath !== `/u/${nick}`) {
      await router.push(`/u/${nick}`)
    }
  }

  return {
    toMyProfile
  }
}
