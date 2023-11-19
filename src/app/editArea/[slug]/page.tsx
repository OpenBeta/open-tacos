import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default async function AreaEditPage ({ params }: DashboardPageProps): Promise<any> {
  if (params.slug == null) {
    notFound()
  }
  redirect(`/editArea/${params.slug}/general`)
}
