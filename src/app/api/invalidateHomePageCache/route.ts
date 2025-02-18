import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * Endpoint: /api/invalidateHomePageCache
 */
export async function GET (request: NextRequest): Promise<any> {
  revalidateTag('home-feed')
  return NextResponse.json({ message: 'OK' }, { status: 200 })
}
