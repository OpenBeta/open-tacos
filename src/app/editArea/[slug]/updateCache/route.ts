import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET (request: Request, res: NextResponse): Promise<NextResponse> {
  revalidatePath('/editArea/[slug]', 'page')
  revalidatePath('/editArea/[slug]/layout', 'page')
  return NextResponse.json({ message: 'ok' })
}
