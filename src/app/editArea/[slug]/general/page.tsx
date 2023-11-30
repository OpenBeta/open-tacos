import { notFound } from 'next/navigation'
import { validate } from 'uuid'
import { ReactNode } from 'react'
import { Metadata } from 'next'

import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { AreaNameForm } from './components/AreaNameForm'
import { AreaDescriptionForm } from './components/AreaDescriptionForm'
import { AreaLatLngForm } from './components/AreaLatLngForm'
import { AddAreaForm } from './components/AddAreaForm'
import { AreaListForm } from './components/AreaList'
import { AreaTypeForm } from './components/AreaTypeForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const { area: { areaName } } = await getPageDataForEdit(params.slug)
  return {
    title: `Editing area ${areaName}`
  }
}

export interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default async function AreaEditPage ({ params }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(params.slug)
  const {
    areaName, uuid, ancestors, pathTokens, children,
    content: { description },
    metadata: { lat, lng, leaf }
  } = area

  return (
    <div className='grid grid-cols-1 gap-y-8'>
      <PageContainer id='general'>
        <AreaNameForm initialValue={areaName} uuid={uuid} />
      </PageContainer>

      <PageContainer id='description'>
        <AreaDescriptionForm initialValue={description} uuid={uuid} />
      </PageContainer>

      <PageContainer id='location'>
        <AreaLatLngForm initLat={lat} initLng={lng} uuid={uuid} />
      </PageContainer>

      <PageContainer id='areaType'>
        <AreaTypeForm area={area} />
      </PageContainer>

      <PageContainer id='addArea'>
        <AddAreaForm area={area} />
      </PageContainer>

      {!leaf &&
        <PageContainer id='children'>
          <AreaListForm
            areaName={areaName}
            uuid={uuid}
            ancestors={ancestors}
            pathTokens={pathTokens}
            areas={children}
          />
        </PageContainer>}
    </div>
  )
}

export const PageContainer: React.FC<{ children: ReactNode, id: string }> = ({ id, children }) => (
  <div id={id}>
    <section className='mt-2 w-full flex flex-col gap-y-8'>
      {children}
    </section>
  </div>
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
