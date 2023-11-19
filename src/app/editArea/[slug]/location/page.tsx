import { AreaLatLngForm } from '../general/AreaLatLngForm'
import { DashboardPageProps, getPageDataForEdit, PageContainer } from '../general/page'

export default async function AreaEditPage ({ params }: DashboardPageProps): Promise<any> {
  const { area: { uuid, metadata: { lat, lng } } } = await getPageDataForEdit(params.slug)

  return (
    <PageContainer>
      <AreaLatLngForm initLat={lat} initLng={lng} uuid={uuid} />
    </PageContainer>
  )
}
