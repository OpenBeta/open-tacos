import { Metadata } from 'next'
import { DashboardPageProps, getPageDataForEdit } from '../general/page'
import { TopoEditor } from './components/TopoEditor'
import { PageContainer } from '../components/EditAreaContainers'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

// Page metadata
export async function generateMetadata ({ params }: DashboardPageProps): Promise<Metadata> {
  const { area: { areaName } } = await getPageDataForEdit(params.slug, 'cache-first')
  return {
    title: `Manage topos in area ${areaName}`
  }
}

export default async function EditToposPage ({ params: { slug } }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(slug)

  return (
    <PageContainer>
      {area.metadata.leaf ? <TopoEditor area={area} /> : <div className='mx-auto bg-amber-100 border-amber-200 border-2 border-solid rounded text-lg mt-10 p-4'>Topo drawing is currently only avaible for areas with routes</div>}
    </PageContainer>
  )
}
