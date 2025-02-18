import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { validate } from 'uuid'

/**
 * Endpoint: /api/invalidateClimbPageCache
 */
export async function GET (request: NextRequest): Promise<any> {
  const uuid = request.nextUrl.searchParams.get('uuid') as string
  if (uuid == null || !validate(uuid)) {
    return NextResponse.json({ message: 'Missing uuid in query string' })
  } else {
    revalidateTag(`climbId=${uuid}`)
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  }
}
