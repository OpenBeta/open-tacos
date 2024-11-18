import { NextRequest, NextResponse } from 'next/server'
import { PREDEFINED_HEADERS, withUserAuth } from '@/js/auth/withUserAuth'
import useUserProfileCmd from '@/js/hooks/useUserProfileCmd'

/**
 * Direct `/api/user/me` to `/u/<user_id`
 */
const getHandler = async (req: NextRequest): Promise<any> => {
  const uuid = req.headers.get(PREDEFINED_HEADERS.user_uuid)
  const accessToken = req.headers.get(PREDEFINED_HEADERS.access_token)

  if (accessToken == null || uuid == null) {
    return NextResponse.json({ status: 500 })
  }

  const url = req.nextUrl.clone()
  url.pathname = '/'

  try {
    const { getUsernameById } = useUserProfileCmd({ accessToken })
    const usernameInfo = await getUsernameById({ userUuid: uuid })
    if (usernameInfo?.username == null) {
      return NextResponse.rewrite(url)
    } else {
      url.pathname = `/u/${usernameInfo.username}`
      return NextResponse.redirect(url)
    }
  } catch (e) {
    return NextResponse.rewrite(url)
  }
}

export const GET = withUserAuth(getHandler)
