import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { validate } from 'uuid'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Endpoint: /api/updateAreaPage
 */
export async function GET (request: NextRequest): Promise<any> {
  const uuid = request.nextUrl.searchParams.get('uuid') as string
  if (uuid == null || !validate(uuid)) {
    return NextResponse.json({ message: 'Missing uuid in query string' })
  } else {
    revalidatePath(`/area/${uuid}`, 'page')
    revalidatePath(`/editArea/${uuid}`, 'layout')
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  }
}
