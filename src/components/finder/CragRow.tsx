import Link from 'next/link'
import CounterPie from '../ui/Statistics/CounterPie'
import { sanitizeName } from '../../js/utils'
import { AreaType } from '../../js/types'
import DTable from '../ui/DTable'

/* eslint-disable-next-line */
const CragRow = ({ id, area_name: _name, totalClimbs, metadata, aggregate}: Partial<AreaType>): JSX.Element => {
  const name = sanitizeName(_name)
  return (
    // eslint-disable-next-line
    <Link href={`crag/${id}`}>
      <a>
        <div
          className='border-b border-b-neutral-200 py-6' onMouseOver={() => {
            // Todo set some state to highlight this crag on the map
          }}
        >
          <div className='flex justify-between items-center'><div className='text-lg font-semibold text-primary'>{name}</div><div>&hearts;</div></div>
          <hr className='w-8 my-2' />
          <div className='text-secondary text-sm'>Climbs for you</div>
          <div className='flex justify-between items-center'>
            <div className='w-24 h-24'><CounterPie total={totalClimbs} forYou={totalClimbs - getRandomInt(totalClimbs)} /></div>
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
