import { useSession } from 'next-auth/react'
import { IUserProfile } from '../../types'

interface PermissionsProps {
  ownerProfileOnPage: IUserProfile
}

interface ReturnType {
  authorized: boolean
}

/**
 * A React hook that checks whether the currently authenticated user is authorized
 * to perform an action on a page or component owned by another user.
 * @param ownerProfileOnPage The page or component owner
 */
export default function usePermissions ({ ownerProfileOnPage }: PermissionsProps): ReturnType {
  const { status, data } = useSession()
  const authorized = status === 'authenticated' && data != null && data.id === ownerProfileOnPage?.authProviderId
  return {
    authorized
  }
}
