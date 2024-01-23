import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Endpoint: `/api/geo`
 */
export async function GET (request: NextRequest): Promise<any> {
  const longitude = request.geo?.longitude
  const latitude = request.geo?.latitude
  if (longitude != null && latitude != null) {
    return NextResponse.json({ longitude, latitude }, { status: 200 })
  }
  return NextResponse.json({ message: 'No geo data' }, { status: 503 })
}
