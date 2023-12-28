import { Metadata } from 'next'
import { DashboardPageProps, getPageDataForEdit } from '../general/page'
import { PageContainer, SectionContainer } from '../components/EditAreaContainers'
import { AddClimbsForm } from './components/AddClimbsForm'
import { ClimbListSection } from '@/app/area/[[...slug]]/sections/ClimbListSection'
import { SortClimbsForm } from './components/sorting/SortClimbsForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const { area: { areaName } } = await getPageDataForEdit(params.slug, 'cache-first')
  return {
    title: `Manage climbs in area ${areaName}`
  }
}

export default async function AddClimbsPage ({ params: { slug } }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(slug)
  const { areaName, uuid, gradeContext, metadata } = area
  const { leaf, isBoulder } = metadata
  return (
    <PageContainer>
      <SectionContainer id='leftToRight'>
        <SortClimbsForm parentAreaId={area.uuid} climbs={area.climbs} gradeContext={gradeContext} />
      </SectionContainer>
      <SectionContainer id='climbList'>
        <ClimbListSection area={area} editMode />
      </SectionContainer>
      <SectionContainer id='addClimbs'>
        <AddClimbsForm parentAreaName={areaName} parentAreaUuid={uuid} gradeContext={gradeContext} canAddClimbs={isBoulder || leaf} />
      </SectionContainer>
    </PageContainer>
  )
}
