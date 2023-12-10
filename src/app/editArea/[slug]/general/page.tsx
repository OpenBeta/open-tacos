import { notFound } from 'next/navigation'
import { validate } from 'uuid'
import { Metadata } from 'next'

import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { AreaNameForm } from './components/AreaNameForm'
import { AreaDescriptionForm } from './components/AreaDescriptionForm'
import { AreaLatLngForm } from './components/AreaLatLngForm'
import { AddAreaForm } from './components/AddAreaForm'
import { AreaListForm } from './components/AreaList'
import { AreaTypeForm } from './components/AreaTypeForm'
import { FetchPolicy } from '@apollo/client'
import { PageContainer, SectionContainer } from '../components/EditAreaContainers'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const { area: { areaName } } = await getPageDataForEdit(params.slug, 'cache-first')
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
    <PageContainer>
      <SectionContainer id='general'>
        <AreaNameForm initialValue={areaName} uuid={uuid} />
      </SectionContainer>

      <SectionContainer id='description'>
        <AreaDescriptionForm initialValue={description} uuid={uuid} />
      </SectionContainer>

      <SectionContainer id='location'>
        <AreaLatLngForm initLat={lat} initLng={lng} uuid={uuid} />
      </SectionContainer>

      <SectionContainer id='areaType'>
        <AreaTypeForm area={area} />
      </SectionContainer>

      <SectionContainer id='addArea'>
        <AddAreaForm area={area} />
      </SectionContainer>

      {!leaf &&
        <SectionContainer id='children'>
          <AreaListForm
            areaName={areaName}
            uuid={uuid}
            ancestors={ancestors}
            pathTokens={pathTokens}
            areas={children}
          />
        </SectionContainer>}
    </PageContainer>
  )
}

export const getPageDataForEdit = async (pageSlug: string, fetchPolicy?: FetchPolicy): Promise<AreaPageDataProps> => {
  if (pageSlug == null) notFound()

  if (!validate(pageSlug)) {
    notFound()
  }

  const pageData = await getArea(pageSlug, fetchPolicy)
  if (pageData == null) {
    notFound()
  }
  return pageData
}
