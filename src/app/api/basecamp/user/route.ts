import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { withUserAuth } from '@/js/auth/withUserAuth'
import { updateUser } from '@/js/auth/ManagementClient'
import { UserRole } from '@/js/types'
import { IUserMetadataOriginal } from '@/js/types/User'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

/**
 * For admins to update user data from Basecamp. Does not support
 * creation of new users (hence userId required).
 */
const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getServerSession({ req, ...authOptions })
    if (session?.user.metadata?.roles?.includes(UserRole.USER_ADMIN) ?? false) {
      const searchParams = req.nextUrl.searchParams
      const userId = searchParams.get('userId')

      if (userId == null) {
        return NextResponse.json(
          { error: "Missing 'userId' in query string" },
          { status: 400 }
        )
      }

      const payload: Partial<IUserMetadataOriginal> = {}
      const orgAdminOrgIds = searchParams.getAll('orgAdminOrgIds')
      if (orgAdminOrgIds.length > 0) {
        payload.orgAdminOrgIds = orgAdminOrgIds
      }

      if (Object.keys(payload).length === 0) {
        return NextResponse.json(
          { error: 'No data to update' },
          { status: 400 }
        )
      }

      const user = await updateUser(userId, payload)
      return NextResponse.json(user, {
        headers: { 'Cache-Control': 'no-store' }
      })
    } else {
      return new NextResponse(null, { status: 401 })
    }
  } catch (e) {
    console.log('/api/basecamp/user', e)
    return new NextResponse(null, { status: 500 })
  }
}

export const POST = withUserAuth(handler)
