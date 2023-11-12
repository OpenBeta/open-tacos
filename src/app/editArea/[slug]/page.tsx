import { notFound } from 'next/navigation'
import { validate } from 'uuid'
import { ReactNode } from 'react'

import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { AreaNameForm } from './general/AreaNameForm'
import { AreaDescriptionForm } from './general/AreaDescriptionForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default async function AreaEditPage ({ params }: DashboardPageProps): Promise<any> {
  const { area: { areaName, uuid, content: { description } } } = await getPageDataForEdit(params.slug)
  return (
    <PageContainer>
      <AreaNameForm initialValue={areaName} uuid={uuid} />
      <AreaDescriptionForm initialValue={description} uuid={uuid} />
    </PageContainer>
  )
}

export const PageContainer: React.FC<{ children: ReactNode } > = ({ children }) => (
  <section className='w-full flex flex-col gap-y-8'>
    {children}
  </section>
)

export const getPageDataForEdit = async (pageSlug: string): Promise<AreaPageDataProps> => {
  if (pageSlug == null) notFound()

  if (!validate(pageSlug)) {
    notFound()
  }

  const pageData = await getArea(pageSlug)
  if (pageData == null) {
    notFound()
  }
  return pageData
}
