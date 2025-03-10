import { notFound, redirect } from 'next/navigation'
import { validate } from 'uuid'
import { Metadata } from 'next'
import { FetchPolicy } from '@apollo/client'

import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { PageContainer, SectionContainer } from '../../components/AreaAndClimbPage/EditAreaContainers'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  // const pageDataForEdit = await getPageDataForEdit(params.slug, 'cache-first')
  // if (pageDataForEdit == null || pageDataForEdit.area == null) {
  //   return {}
  // }

  // const { area: { areaName } } = pageDataForEdit
  return {
    title: 'Editing climb climbnamehere'
  }
}

export interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default async function AreaEditPage ({ params }: DashboardPageProps): Promise<any> {
  // const pageDataForEdit = await getPageDataForEdit(params.slug)
  // if (pageDataForEdit == null || pageDataForEdit.area == null) {
  //   notFound()
  // }

  // const { area } = pageDataForEdit
  // const {
  //   areaName, uuid, ancestors, pathTokens, children,
  //   content: { description, areaLocation },
  //   metadata: { lat, lng, leaf }
  // } = area

  return (
    <PageContainer>
      <SectionContainer id='general'>
        climb name form here
      </SectionContainer>

      <SectionContainer id='description'>
        descrip here
      </SectionContainer>

      <SectionContainer id='areaLocation'>
        localtion here
      </SectionContainer>

      <SectionContainer id='location'>
        lat and long here?
      </SectionContainer>

      <SectionContainer id='areaType'>
        Climb type form
      </SectionContainer>

    </PageContainer>
  )
}

// export const getPageDataForEdit = async (pageSlug: string, fetchPolicy?: FetchPolicy): Promise<AreaPageDataProps> => {
//   if (pageSlug == null) notFound()

//   if (!validate(pageSlug)) {
//     notFound()
//   }

//   const pageData = await getArea(pageSlug, fetchPolicy)
//   if (pageData == null || pageData.area == null) {
//     notFound()
//   }
//   return pageData
// }
