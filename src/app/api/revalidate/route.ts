import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { withUserAuth } from '@/js/auth/withUserAuth'
import { checkUsername } from '@/js/utils'

/**
 * Notify backend to regenerate a page.
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
 */
const handler = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const username = req.nextUrl.searchParams.get('u')
    const page = req.nextUrl.searchParams.get('page')

    let revalidated = false

    // Handle user profile revalidation
    if (username != null && checkUsername(username)) {
      revalidatePath(`/u/${encodeURIComponent(username)}`)
      revalidated = true
    }

    // Handle other pages revalidation
    const ALLOWS = ['/edit']
    if (page != null && ALLOWS.includes(page)) {
      revalidatePath(page)
      revalidated = true
    }

    return NextResponse.json({ revalidated })
  } catch (e) {
    return NextResponse.json(
      { error: 'Error revalidating page' },
      { status: 500 }
    )
  }
}

export const GET = withUserAuth(handler)
