import { NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/edge'

export const runtime = 'edge'

/**
 * Endpoint: `/api/geo`
 */
export async function GET (request: NextRequest): Promise<any> {
  const geo = geolocation(request)
  const longitude = geo?.longitude
  const latitude = geo?.latitude
  if (longitude != null && latitude != null) {
    return NextResponse.json({ longitude, latitude }, { status: 200 })
  }
  return NextResponse.json({ message: 'No geo data' }, { status: 503 })
}
