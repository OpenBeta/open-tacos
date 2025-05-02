import { NextRequest, NextResponse } from 'next/server'
import { PREDEFINED_HEADERS, withUserAuth } from '@/js/auth/withUserAuth'
import useUserProfileCmd from '@/js/hooks/useUserProfileCmd'

/**
 * Direct `/api/user/me` to `/u/<user_id>`
 */
const getHandler = async (req: NextRequest): Promise<any> => {
  const uuid = req.headers.get(PREDEFINED_HEADERS.user_uuid)
  const accessToken = req.headers.get(PREDEFINED_HEADERS.access_token)

  if (accessToken == null || uuid == null) {
    return NextResponse.json({ status: 500 })
  }

  try {
    const { getUsernameById } = useUserProfileCmd({ accessToken })
    const usernameInfo = await getUsernameById({ userUuid: uuid })
    if (usernameInfo?.username == null) {
      return NextResponse.rewrite('/')
    } else {
      const origin = process.env?.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin
      const url = `${origin}/u/${usernameInfo.username}`
      return Response.redirect(url, 307)
    }
  } catch (e) {
    return NextResponse.rewrite('/')
  }
}

export const GET = withUserAuth(getHandler)
