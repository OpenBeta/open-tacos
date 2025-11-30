import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { withUserAuth } from '@/js/auth/withUserAuth'
import { getAllUsersMetadata } from '@/js/auth/ManagementClient'
import { UserRole } from '@/js/types'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getServerSession({ req, ...authOptions })
    if (session?.user.metadata?.roles?.includes(UserRole.USER_ADMIN) ?? false) {
      const searchParams = req.nextUrl.searchParams
      const page = searchParams.get('page') ?? '1'
      const type = searchParams.get('type') ?? 'auth0'
      const email = searchParams.get('email') ?? undefined

      const params = {
        page: parseInt(page),
        connectionType: type as ('auth0' | 'email'),
        email
      }
      const users = await getAllUsersMetadata(params)
      return NextResponse.json(users, {
        headers: { 'Cache-Control': 'no-store' }
      })
    } else {
      return new NextResponse(null, { status: 401 })
    }
  } catch (e) {
    console.log('/api/basecamp/users', e)
    return new NextResponse(null, { status: 500 })
  }
}

export const GET = withUserAuth(handler)
