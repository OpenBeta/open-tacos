import { cragFiltersStore } from '../../js/stores'
import { CountByDisciplineType } from '../../js/types'

const DISCIPLINES = [
  'sport',
  'trad',
  'tr',
  'boulder'
]

interface DTableProps {
  byDisciplineAgg: CountByDisciplineType
}

/**
 * Grade distribution table
 * @param CountByDisciplineType stat aggregate
 */
const DTable = ({ byDisciplineAgg }: DTableProps): JSX.Element => {
  const { trad, sport, boulder, tr } = cragFiltersStore.get
  const [myLowFreeBand, myHighFreeBand] = cragFiltersStore.get.freeBandRange()
  const [myLowBoulderBand, myHighBoulderBand] = cragFiltersStore.get.boulderBandRange()
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
            let myLowBand: number
            let myHighBand: number

            if (['trad', 'sport', 'tr'].includes(d)) {
              myLowBand = myLowFreeBand
              myHighBand = myHighFreeBand
            } else {
              myLowBand = myLowBoulderBand
              myHighBand = myHighBoulderBand
            }

            return (
              <Row
                key={d}
                rowHeader={d}
                total={byDisciplineAgg?.[d]?.total}
                {...byDisciplineAgg[d]?.bands}
                myRange={[myLowBand, myHighBand]}
                highlighted={shouldHighlight(d, trad(), sport(), boulder(), tr())}
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
  advanced: number
  expert: number
  total: number
  myRange: number[]
  highlighted: boolean
}

const Row = ({ rowHeader, beginner, intermediate, advanced, expert, total, myRange, highlighted }: RowProps): JSX.Element => {
  return (
    <tr className='text-tertiary text-xs my-2'>
      <th scope='row' className='py-0.5 pr-2 text-right'>{rowHeader}</th>
      <td className={`${highlighted ? 'text-base-content' : ''} ${highlighted && isInMyRange(0, myRange) ? 'dtable-my-range' : ''}`}>{beginner}</td>
      <td className={`${highlighted ? 'text-base-content' : ''} ${highlighted && isInMyRange(1, myRange) ? 'dtable-my-range' : ''}`}>{intermediate}</td>
      <td className={`${highlighted ? 'text-base-content' : ''} ${highlighted && isInMyRange(2, myRange) ? 'dtable-my-range' : ''}`}>{advanced}</td>
      <td className={`${highlighted ? 'text-base-content' : ''} ${highlighted && isInMyRange(3, myRange) ? 'dtable-my-range' : ''}`}>{expert}</td>
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

const isInMyRange = (thisIndex: number, myRange: number[]): boolean => {
  if (thisIndex >= myRange[0] && thisIndex <= myRange[1]) {
    return true
  }
  return false
}
