import Link from 'next/link'
// import CounterPie from '../ui/Statistics/CounterPie'
import { sanitizeName } from '../../js/utils'

interface CragRowProps {
  id: string
  area_name: string
  totalClimbs: number
}
/* eslint-disable-next-line */
const CragRow = ({ id, area_name, totalClimbs}: CragRowProps): JSX.Element => { 
  return (
    <Link href={`crag/${id}`}>
      <a>
        <div className='first:border-t border-b border-b-neutral-200 py-6'>
          <div className='flex justify-between items-center'><div className='text-lg font-medium text-primary'>{sanitizeName(area_name)}</div><div>&hearts;</div></div>
          <hr className='w-8 my-2' />
          <div className='flex flex-col space-y-2'>
            <div className='text-secondary text-sm'><span className='font-semibold'>{totalClimbs - getRandomInt(totalClimbs)} climbs for you</span> · {totalClimbs} total </div>
            <div><DistributionTable totalClimbs={totalClimbs} /></div>
            {/* <div className='w-24 h-24'><CounterPie total={totalClimbs} forYou={totalClimbs - getRandomInt(totalClimbs)} /></div> */}
          </div>
        </div>
      </a>
    </Link>
  )
}

const DistributionTable = ({ totalClimbs }): JSX.Element => {
  return (
    <table className='table-fixed text-sm border border-collapse border-slate-800'>
      <thead className='bg-slate-800 text-primary-contrast text-center'>
        <tr>
          <th className='px-2 font-semibold'>Beginner</th>
          <th className='px-2 font-semibold'>Intermediate</th>
          <th className='px-2 font-semibold'>Advanced</th>
          <th className='px-2 font-semibold'>Expert</th>
        </tr>
      </thead>
      <tbody className='text-center text-secondary'>
        <tr>
          <td className='border border-slate-300 bg-amber-100'>{getRandomInt(totalClimbs)}</td>
          <td className='border border-slate-300'>{getRandomInt(totalClimbs)}</td>
          <td className='border border-slate-300'>{getRandomInt(totalClimbs)}</td>
          <td className='border border-slate-300'>{getRandomInt(totalClimbs)}</td>
        </tr>
      </tbody>
    </table>
  )
}

function getRandomInt (max: number): number {
  return Math.floor(Math.random() * max)
}

export default CragRow
