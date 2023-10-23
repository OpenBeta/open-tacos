import Link from 'next/link'
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { getUSATableOfContent } from '@/js/graphql/getPopularAreasUSA'

/**
 * USA table of content
 */
export const USAToC: React.FC = async () => {
  const toc = await getUSATableOfContent()
  return (
    <section className='mt-16 px-4 2xl:px-0 mx-auto max-w-5xl xl:max-w-7xl'>
      <Link href='/crag/1db1e8ba-a40e-587c-88a4-64f5ea814b8e' className='flex flex-row items-center gap-2'><h2>USA</h2><ArrowRightCircleIcon className='w-4 h-4' /></Link>
      <hr className='mb-6 border-2 border-base-content' />
      <div className='columns-3xs gap-x-10'>
        {Array.from(toc.values()).map(state => {
          const { name, uuid, totalClimbs, areas } = state
          return (
            <div key={name} className='mb-10 break-inside-avoid-column break-inside-avoid'>
              <Link href={`/crag/${uuid}`} className='flex items-end justify-between'>
                <span className=' font-semibold'>{name}</span>
                <span className='text-xs text-base-content/80'>
                  {new Intl.NumberFormat().format(totalClimbs)}
                </span>
              </Link>
              <hr className='mb-2 border-1 border-base-content/60' />
              <div className='flex flex-col'>
                {areas.map(area => {
                  const { uuid, areaName } = area
                  return (<Link key={uuid} className='text-xs hover:underline' href={`/crag/${uuid}`} prefetch={false}>{areaName}</Link>)
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
