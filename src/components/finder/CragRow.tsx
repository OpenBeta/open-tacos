import Link from 'next/link'
import CounterPie from '../ui/Statistics/CounterPie'
import { sanitizeName } from '../../js/utils'
import { AreaType } from '../../js/types'
import DTable from '../ui/DTable'
import { MiniCrumbs } from '../ui/BreadCrumbs'
import useResponsive from '../../js/hooks/useResponsive'

const CragRow = ({ areaName, totalClimbs, metadata, aggregate, pathTokens }: Partial<AreaType>): JSX.Element => {
  const name = sanitizeName(areaName)
  const { areaId } = metadata
  const { isMobile } = useResponsive()

  return (
    <Link href={`crag/${areaId as string}`}>
      <a>
        <div
          className='border-b border-b-slate-500 py-6' onMouseOver={() => {
            // Todo set some state to highlight this crag on the map
          }}
        >
          <div><MiniCrumbs pathTokens={pathTokens} end={2} skipLast /></div>
          <div className='flex justify-between items-center'>
            <div className='text-lg font-semibold text-primary'>
              {name}
            </div>
          </div>
          <hr className='w-8 my-2' />
          <div className='text-secondary text-sm'>Climbs for you</div>
          <div className='flex justify-between items-center'>
            {!isMobile && <div className='md:block w-24 h-24'><CounterPie total={totalClimbs} forYou={totalClimbs - getRandomInt(totalClimbs)} /></div>}
            <div>
              <DTable byDisciplineAgg={aggregate.byDiscipline} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

function getRandomInt (max: number): number {
  return Math.floor(Math.random() * max)
}

export default CragRow
