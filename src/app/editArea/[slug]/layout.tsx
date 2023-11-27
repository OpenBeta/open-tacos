import { ArrowUUpLeft } from '@phosphor-icons/react/dist/ssr'
import { SidebarNav } from './SidebarNav'
import { getPageDataForEdit } from './general/page'
import { GluttenFreeCrumbs } from '@/components/ui/BreadCrumbs'
import { getAreaPageFriendlyUrl } from '@/js/utils'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

/**
 * Layout for edit area dashboard
 */
export default async function RootLayout ({
  children, params
}: {
  children: React.ReactNode
  params: { slug: string }
}): Promise<any> {
  const { area: { uuid, pathTokens, ancestors, areaName } } = await getPageDataForEdit(params.slug)
  return (
    <div>
      <div className='px-12 pt-8 pb-4'>
        <div className='text-3xl tracking-tight font-semibold'>Edit area</div>

        <GluttenFreeCrumbs pathTokens={pathTokens} ancestors={ancestors} />
        <div className='text-sm flex justify-end'>
          <a href={getAreaPageFriendlyUrl(uuid, areaName)} className='flex items-center gap-2 hover:underline'>
            Return to public version <ArrowUUpLeft size={18} />
          </a>
        </div>
      </div>

      <hr className='border-1' />

      <div className='pt-12 flex bg-base-200 flex-col lg:flex-row'>
        <SidebarNav slug={params.slug} />
        <main className='w-full px-2 lg:px-16'>
          {children}
        </main>
      </div>
    </div>
  )
}
