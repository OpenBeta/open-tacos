import { notFound } from 'next/navigation'
import { validate } from 'uuid'
import { Metadata } from 'next'
import { FetchPolicy } from '@apollo/client'
import { ArrowCircleRight } from '@phosphor-icons/react/dist/ssr'

import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { AreaNameForm } from './components/AreaNameForm'
import { AreaDescriptionForm } from './components/AreaDescriptionForm'
import { AreaLatLngForm } from './components/AreaLatLngForm'
import { AddAreaForm } from './components/AddAreaForm'
import { AreaListForm } from './components/AreaList'
import { AreaTypeForm } from './components/AreaTypeForm'
import { PageContainer, SectionContainer } from '../components/EditAreaContainers'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const pageDataForEdit = await getPageDataForEdit(params.slug, 'cache-first')
  if (pageDataForEdit == null || pageDataForEdit.area == null) {
    return {}
  }

  const { area: { areaName } } = pageDataForEdit
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
  const pageDataForEdit = await getPageDataForEdit(params.slug)
  if (pageDataForEdit == null || pageDataForEdit.area == null) {
    notFound()
  }

  const { area } = pageDataForEdit
  const {
    areaName, uuid, ancestors, pathTokens, children,
    content: { description },
    metadata: { lat, lng, leaf }
  } = area

  const canAddClimbs = leaf && children.length === 0

  return (
    <PageContainer>
      <SectionContainer id='general'>
        <AreaNameForm initialValue={areaName} uuid={uuid} />
      </SectionContainer>

      <SectionContainer id='description'>
        <AreaDescriptionForm initialValue={description} uuid={uuid} />
      </SectionContainer>

      <SectionContainer id='location'>
        <AreaLatLngForm initLat={lat} initLng={lng} uuid={uuid} isLeaf={leaf} />
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

      <SectionContainer id='manageClimbs'>
        <div className='card card-bordered border-base-300 /40 overflow-hidden w-full bg-base-100'>
          <div className='card-body'>
            <h4 className='font-semibold text-2xl'>Manage Climbs</h4>
            {canAddClimbs
              ? (
                <div className='alert'>
                  <a href={`/editArea/${uuid}/manageClimbs`} className='btn btn-link'>Manage climbs page <ArrowCircleRight size={20} /></a>
                </div>
                )
              : <div className='alert'>This area contains subareas.  Please add climbs to areas designated as crags or boulders. </div>}
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  )
}

export const getPageDataForEdit = async (pageSlug: string, fetchPolicy?: FetchPolicy): Promise<AreaPageDataProps> => {
  if (pageSlug == null) notFound()

  if (!validate(pageSlug)) {
    notFound()
  }

  const pageData = await getArea(pageSlug, fetchPolicy)
  if (pageData == null || pageData.area == null) {
    notFound()
  }
  return pageData
}
