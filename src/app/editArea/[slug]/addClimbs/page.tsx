import { DashboardPageProps, getPageDataForEdit } from '../general/page'
import { PageContainer, SectionContainer } from '../components/EditAreaContainers'
import { AddClimbsForm } from './components/AddClimbsForm'

export default async function AddClimbsPage ({ params: { slug } }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(slug)
  const {
    areaName, uuid, ancestors, pathTokens, children
  } = area
  return (
    <PageContainer>
      <SectionContainer id='general'>
        <AddClimbsForm parentAreaUuid={uuid} />
      </SectionContainer>
    </PageContainer>
  )
}
