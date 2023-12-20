import { DashboardPageProps, getPageDataForEdit } from '../general/page'
import { PageContainer, SectionContainer } from '../components/EditAreaContainers'
import { AddClimbsForm } from './components/AddClimbsForm'

export default async function AddClimbsPage ({ params: { slug } }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(slug)
  const { areaName, uuid, gradeContext, metadata } = area
  const { leaf, isBoulder } = metadata
  return (
    <PageContainer>
      <SectionContainer id='general'>
        <AddClimbsForm parentAreaName={areaName} parentAreaUuid={uuid} gradeContext={gradeContext} canAddClimbs={isBoulder || leaf} />
      </SectionContainer>
    </PageContainer>
  )
}
