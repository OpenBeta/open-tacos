import Link from 'next/link'
import { cragFiltersStore } from '../../js/stores'
import CounterPie from '../ui/Statistics/CounterPie'
import { sanitizeName } from '../../js/utils'
import { AreaType, CountByDisciplineType } from '../../js/types'
import { getBandIndex } from '../../js/grades/bandUtil'

/* eslint-disable-next-line */
const CragRow = ({ id, area_name: _name, totalClimbs, metadata, aggregate}: Partial<AreaType>): JSX.Element => {
  const name = sanitizeName(_name)
  return (
    // eslint-disable-next-line
    <Link href={`crag/${id}`}>
      <a>
        <div
          className='border-b border-b-neutral-200 py-6' onMouseOver={() => {
            // Todo set some state to highlight crag on the map
          }}
        >
          <div className='flex justify-between items-center'><div className='text-lg font-semibold text-primary'>{name}</div><div>&hearts;</div></div>
          <hr className='w-8 my-2' />
          <div className='text-secondary text-sm'>Climbs for you</div>
          <div className='flex justify-between items-center'>
            <div className='w-24 h-24'><CounterPie total={totalClimbs} forYou={totalClimbs - getRandomInt(totalClimbs)} /></div>
            <div><DistributionTable totalClimbs={totalClimbs} byDiscipline={aggregate.byDiscipline} /></div>
          </div>
        </div>
      </a>
    </Link>
  )
}

interface DistributionTableProps {
  byDiscipline: CountByDisciplineType
  totalClimbs: number

}
const DistributionTable = ({ totalClimbs, byDiscipline }: DistributionTableProps): JSX.Element => {
  const { freeRange } = cragFiltersStore.useStore()
  const myLowBand = getBandIndex(freeRange.labels[0])
  const myHighBand = getBandIndex(freeRange.labels[1])
  return (
    <table className='table-fixed text-sm rounded'>
      <thead className=' text-center text-xs'>
        <tr>
          <th />
          <th className='py-1 px-2 font-normal text-secondary'>Beginner</th>
          <th className='py-1 px-2 font-normal text-secondary'>Intermediate</th>
          <th className='py-1 px-2 font-normal text-secondary'>Advanced</th>
          <th className='py-1 px-2 font-normal text-secondary'>Expert</th>
          <th className='py-1 px-2 font-normal text-secondarybg-slate-400'>Total</th>
        </tr>
      </thead>
      <tbody className='text-center text-secondary divide-y divide-y-4 divide-white'>

        {(byDiscipline?.sport?.total > 0 ?? false) &&
      (
        <tr className={`${cragFiltersStore.get.sport() ? 'bg-slate-100' : 'text-tertiary bg-inherit'}`}>
          <td className='border-0'>Sport</td>
          <td className='bg-gradient-to-r from-ob-secondary'>{byDiscipline?.sport?.bands.beginner}</td>
          <td className='py-1'>{byDiscipline?.sport?.bands?.intermediate}</td>
          <td className='py-1'>{byDiscipline?.sport?.bands?.advance}</td>
          <td className='py-1'>{byDiscipline?.sport?.bands?.expert}</td>
          <td className='py-1 border-l border-slate-500 bg-slate-600 text-white'>{byDiscipline?.sport.total}</td>
        </tr>
      )}
        {(byDiscipline?.trad?.total > 0 ?? false) &&
      (
        <tr className={`${cragFiltersStore.get.trad() ? 'bg-slate-100' : 'text-tertiary bg-inherit'}`}>
          <td className='border-0'>Trad</td>
          <td className={`py-1 ${isInMyRange(0, [myLowBand, myHighBand]) ? 'bg-ob-secondary' : ''}`}>{byDiscipline?.trad?.bands.beginner}</td>
          <td className={`py-1 ${isInMyRange(1, [myLowBand, myHighBand]) ? 'bg-ob-secondary' : ''}`}>{byDiscipline?.trad?.bands?.intermediate}</td>
          <td className='py-1'>{byDiscipline?.trad?.bands?.advance}</td>
          <td className='py-1'>{byDiscipline?.trad?.bands?.expert}</td>
          <td className='py-1 border-l border-slate-500 bg-slate-600 text-white'>{byDiscipline?.trad.total}</td>
        </tr>
      )}
        {(byDiscipline?.boulder?.total > 0 ?? false) &&
      (
        <tr className={`${cragFiltersStore.get.bouldering() ? 'bg-slate-100' : 'text-tertiary bg-inherit'}`}>
          <td className='border-0'>Bouldering</td>
          <td className='bg-gradient-to-r from-ob-secondary'>{byDiscipline?.boulder?.bands.beginner}</td>
          <td className='py-1'>{byDiscipline?.boulder?.bands?.intermediate}</td>
          <td className='py-1'>{byDiscipline?.boulder?.bands?.advance}</td>
          <td className='py-1'>{byDiscipline?.boulder?.bands?.expert}</td>
          <td className='py-1 border-l border-slate-500 bg-slate-600 text-white'>{byDiscipline?.boulder.total}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

const isInMyRange = (thisIndex: number, myFreeRange: number[]): boolean => {
  if (thisIndex >= myFreeRange[0] && thisIndex <= myFreeRange[1]) {
    return true
  }
  return false
}

function getRandomInt (max: number): number {
  return Math.floor(Math.random() * max)
}

export default CragRow
