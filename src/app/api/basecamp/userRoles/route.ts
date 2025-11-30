import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { withUserAuth } from '@/js/auth/withUserAuth'
import { getUserRoles, setUserRoles } from '@/js/auth/ManagementClient'
import { UserRole } from '@/js/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

const checkAdminAndUserId = async (req: NextRequest): Promise<{ isAdmin: boolean, userId: string | null }> => {
  const session = await getServerSession({ req, ...authOptions })
  const isAdmin = session?.user.metadata?.roles?.includes(UserRole.USER_ADMIN) ?? false
  const userId = req.nextUrl.searchParams.get('userId')
  return { isAdmin, userId }
}

const handleGet = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { isAdmin, userId } = await checkAdminAndUserId(req)

    if (!isAdmin) {
      return new NextResponse(null, { status: 401 })
    }

    if (userId == null) {
      return NextResponse.json(
        { error: "Missing 'userId' in query string" },
        { status: 400 }
      )
    }

    const rolesResp = await getUserRoles(userId)
    return NextResponse.json(rolesResp.data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (e) {
    console.log('/api/basecamp/userRoles GET', e)
    return new NextResponse(null, { status: 500 })
  }
}

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { isAdmin, userId } = await checkAdminAndUserId(req)

    if (!isAdmin) {
      return new NextResponse(null, { status: 401 })
    }

    if (userId == null) {
      return NextResponse.json(
        { error: "Missing 'userId' in query string" },
        { status: 400 }
      )
    }

    const roles = req.nextUrl.searchParams.getAll('roles')
    if (roles.length === 0) {
      return NextResponse.json(
        { error: "Missing 'roles' in query string" },
        { status: 400 }
      )
    }

    await setUserRoles(userId, roles)
    return new NextResponse(null, { status: 200 })
  } catch (e) {
    console.log('/api/basecamp/userRoles POST', e)
    return new NextResponse(null, { status: 500 })
  }
}

export const GET = withUserAuth(handleGet)
export const POST = withUserAuth(handlePost)
