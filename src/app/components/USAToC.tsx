import Link from 'next/link'
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { getUSATableOfContent } from '@/js/graphql/getPopularAreasUSA'
import { SectionContainer } from './ui/SectionContainer'
/**
 * USA table of content
 */
export const USAToC: React.FC = async () => {
  const toc = await getUSATableOfContent()
  return (
    <SectionContainer
      header={
        <Link href='/crag/1db1e8ba-a40e-587c-88a4-64f5ea814b8e' className='flex flex-row items-center gap-2'>
          <h2>USA</h2><ArrowRightCircleIcon className='w-4 h-4' />
        </Link>
      }
    >
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
                {
                  areas.map((area) => <ToCAreaEntry key={area.uuid} {...area} />)
                }
              </div>
            </div>
          )
        })}
      </div>
    </SectionContainer>
  )
}

export const ToCAreaEntry: React.FC<{ uuid: string, areaName: string }> =
  ({ uuid, areaName }) => (<Link key={uuid} className='text-xs hover:underline' href={`/crag/${uuid}`} prefetch={false}>{areaName}</Link>)
