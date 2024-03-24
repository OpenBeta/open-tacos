import { ArrowUUpLeft } from '@phosphor-icons/react/dist/ssr'
import { SidebarNav } from './components/SidebarNav'
import { getPageDataForEdit } from './general/page'
import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { getAreaPageFriendlyUrl } from '@/js/utils'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

/**
 * Layout for edit area dashboard
 */
export default async function EditAreaDashboardLayout ({
  children, params
}: {
  children: React.ReactNode
  params: { slug: string }
}): Promise<any> {
  const pageDataForEdit = await getPageDataForEdit(params.slug)
  if (pageDataForEdit == null || pageDataForEdit.area == null) {
    return <div />
  }
  const { area: { uuid, pathTokens, ancestors, areaName, children: subAreas, climbs, metadata: { leaf, isBoulder } } } = pageDataForEdit
  return (
    <div className='relative w-full h-full'>
      <div className='px-12 pt-8 pb-4'>
        <div className='text-3xl tracking-tight font-semibold'>Edit area</div>

        <div className='text-sm flex justify-end'>
          <a href={getAreaPageFriendlyUrl(uuid, areaName)} className='flex items-center gap-2 hover:underline'>
            Return to public version <ArrowUUpLeft size={18} />
          </a>
        </div>
      </div>

      <div className='bg-base-200'>
        <div className='z-20 sticky top-0 py-2 px-6 bg-base-200 w-full border-t border-b'>
          <AreaCrumbs pathTokens={pathTokens} ancestors={ancestors} editMode />
        </div>
        <div className='flex bg-base-200 flex-col lg:flex-row py-12'>
          <SidebarNav
            slug={params.slug}
            canAddAreas={!leaf}
            canAddClimbs={leaf}
            areaCount={subAreas.length}
            climbCount={climbs.length}
            isLeaf={leaf}
            isBoulder={isBoulder}
          />
          <main className='relative h-full w-full px-2 lg:px-16'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
