import { Metadata } from 'next'
import { DashboardPageProps, getPageDataForEdit } from '../general/page'
import { PageContainer, SectionContainer } from '../components/EditAreaContainers'
import { SortAreasForm } from './components/sorting/SortAreasForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const { area: { areaName } } = await getPageDataForEdit(params.slug, 'cache-first')
  return {
    title: `Manage child areas in ${areaName}`
  }
}

export default async function AddClimbsPage ({ params: { slug } }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(slug)
  const { uuid, children } = area
  const canEditLeaves = !area.metadata.leaf
  return (
    <PageContainer>
      <SectionContainer id='sortChildAreas'>
        <SortAreasForm parentAreaId={uuid} areas={children} canEdit={canEditLeaves} />
      </SectionContainer>
    </PageContainer>
  )
}
