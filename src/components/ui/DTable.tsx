import { cragFiltersStore } from '../../js/stores'
import { CountByDisciplineType } from '../../js/types'
import { getBandIndex } from '../../js/grades/bandUtil'

const DISCIPLINES = [
  'sport',
  'trad',
  'tr',
  'boulder'
]

interface DTableProps {
  byDisciplineAgg: CountByDisciplineType
}

const DTable = ({ byDisciplineAgg }: DTableProps): JSX.Element => {
  const { freeRange, trad, sport, bouldering, tr } = cragFiltersStore.useStore()
  const myLowBand = getBandIndex(freeRange.labels[0])
  const myHighBand = getBandIndex(freeRange.labels[1])
  return (
    <table
      className='table-fixed text-sm rounded border-separate'
      style={{ borderSpacing: '0 0.25rem' }}
    >
      <thead className=' text-center text-xs'>
        <tr>
          <th />
          <th className='py-1 px-2 font-normal text-secondary'>Beginner</th>
          <th className='py-1 px-2 font-normal text-secondary'>Intermediate</th>
          <th className='py-1 px-2 font-normal text-secondary'>Advanced</th>
          <th className='py-1 px-2 font-normal text-secondary'>Expert</th>
        </tr>
      </thead>
      <tbody className='text-center text-secondary [border-spacing:0.25rem]'>
        {
          DISCIPLINES.map(d => {
            if (byDisciplineAgg[d] === null) {
              return null
            }

            return (
              <Row
                key={d}
                rowHeader={d}
                total={byDisciplineAgg?.[d]?.total}
                {...byDisciplineAgg[d]?.bands}
                myFreeRange={[myLowBand, myHighBand]}
                highlighted={shouldHighlight(d, trad, sport, bouldering, tr)}
              />
            )
          })

        }
      </tbody>
    </table>
  )
}

export default DTable

interface RowProps {
  rowHeader: string
  beginner: number
  intermediate: number
  advance: number
  expert: number
  total: number
  myFreeRange: number[]
  highlighted: boolean
}

const Row = ({ rowHeader, beginner, intermediate, advance, expert, total, myFreeRange, highlighted }: RowProps): JSX.Element => {
  return (
    <tr className='text-tertiary text-xs my-2'>
      <th scope='row' className='py-0.5 pr-2 text-right'>{rowHeader}</th>
      <td className={`${highlighted ? 'dtable-highlight' : ''} ${highlighted && isInMyRange(0, myFreeRange) ? 'dtable-my-range' : ''}`}>{beginner}</td>
      <td className={`${highlighted ? 'dtable-highlight' : ''} ${highlighted && isInMyRange(1, myFreeRange) ? 'dtable-my-range' : ''}`}>{intermediate}</td>
      <td className={`${highlighted ? 'dtable-highlight' : ''} ${highlighted && isInMyRange(2, myFreeRange) ? 'dtable-my-range' : ''}`}>{advance}</td>
      <td className={`${highlighted ? 'dtable-highlight' : ''} ${highlighted && isInMyRange(3, myFreeRange) ? 'dtable-my-range' : ''}`}>{expert}</td>
    </tr>
  )
}

const shouldHighlight = (key: string, trad: boolean, sport: boolean, bouldering: boolean, tr: boolean): boolean => {
  if (trad && key === 'trad') {
    return true
  } else if (sport && key === 'sport') {
    return true
  } else if (bouldering && key === 'boulder') {
    return true
  } if (tr && key === 'tr') {
    return true
  }
  return false
}

const isInMyRange = (thisIndex: number, myFreeRange: number[]): boolean => {
  if (thisIndex >= myFreeRange[0] && thisIndex <= myFreeRange[1]) {
    return true
  }
  return false
}
