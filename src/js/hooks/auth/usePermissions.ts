import { useSession } from 'next-auth/react'
import { WithPermission } from '../../types/User'

interface PermissionsProps {
  currentUserUuid?: string
}

/**
 * A React hook that checks whether the currently authenticated user is authorized
 * to perform an action on a page or component owned by another user.
 * @param currentUserUuid userUuid to check
 */
export default function usePermissions ({ currentUserUuid }: PermissionsProps): WithPermission {
  const { status, data } = useSession()
  console.log('Session status:', status)
  console.log('Session data:', data)
  console.log('Current User UUID:', currentUserUuid)

  const isAuthorized = status === 'authenticated' &&
    data != null &&
    data.user.metadata.uuid === currentUserUuid &&
    currentUserUuid != null

  return {
    isAuthorized,
    isAuthenticated: status === 'authenticated'
  }
}
