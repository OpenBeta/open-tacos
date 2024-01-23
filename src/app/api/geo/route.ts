import { NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/edge'

export const runtime = 'edge'

/**
 * Return latitude and longitude of the visitor. Only works when deploying on Vercel.
 * Endpoint: `/api/geo`
 */
export async function GET (request: NextRequest): Promise<any> {
  const geo = geolocation(request)
  const longitude = geo?.longitude
  const latitude = geo?.latitude
  if (longitude != null && latitude != null) {
    return NextResponse.json({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) }, { status: 200 })
  }
  return NextResponse.json({ message: 'No geo data available.' }, { status: 503 })
}
