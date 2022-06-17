import { useSession } from 'next-auth/react'
import { IUserProfile, WithPermission } from '../../types/User'

interface PermissionsProps {
  ownerProfileOnPage: IUserProfile
}

/**
 * A React hook that checks whether the currently authenticated user is authorized
 * to perform an action on a page or component owned by another user.
 * @param ownerProfileOnPage The page or component owner
 */
export default function usePermissions ({ ownerProfileOnPage }: PermissionsProps): WithPermission {
  const { status, data } = useSession()
  const isAuthorized = status === 'authenticated' && data != null && data.id === ownerProfileOnPage?.authProviderId
  return {
    isAuthorized,
    isAuthenticated: status === 'authenticated'
  }
}
