import { DashboardPageProps, getPageDataForEdit, PageContainer } from '../general/page'
import { AreaList } from './components/AreaList'
import { AddAreaForm } from './AddAreaForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

/**
 * Area management
 */
export default async function Page ({ params }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(params.slug)

  const { areaName, uuid, ancestors, pathTokens, children } = area

  return (
    <PageContainer>
      <AddAreaForm area={area} />
      <AreaList
        areaName={areaName}
        uuid={uuid}
        ancestors={ancestors}
        pathTokens={pathTokens}
        areas={children}
      />
    </PageContainer>
  )
}
