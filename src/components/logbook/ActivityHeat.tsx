import { useState, useMemo, ReactElement } from 'react'
import { ResponsiveContainer, XAxis, YAxis, ZAxis, Tooltip, ScatterChart, Scatter } from 'recharts'
import { groupBy } from 'underscore'
import { getWeek, format, eachYearOfInterval, eachWeekOfInterval } from 'date-fns'
import classNames from 'classnames'

import { ChartsSectionProps } from './ChartsSection'
import { TickType } from '../../js/types'
import { ScatterPointItem } from 'recharts/types/cartesian/Scatter'

interface DataProps {
  x: number
  y: string
  z: number
}

/**
 * Recharts doesn't export/define all of its types so
 * we come up this this hack.
 */
type ScatterPointProps = Pick<DataProps, 'z'> & ScatterPointItem & {
  cx: number
  cy: number
  xAxis: {
    bandSize: number
  }
  yAxis: {
    bandSize: number
  }
}

/**
 * Show a year of activities in a grid
 */
const ActivityHeat: React.FC<ChartsSectionProps> = ({ tickList }) => {
  if (tickList == null) return null

  const years = eachYearOfInterval({
    start: new Date(tickList[0].dateClimbed),
    end: new Date(tickList[tickList.length - 1].dateClimbed)
  })

  const [currentYear, setYear] = useState(years[years.length - 1].getFullYear())

  const aggByYear = useMemo(() => {
    return groupBy(tickList, getYearFromTick)
  }, [tickList])

  const ticksForSelectedYear = aggByYear[currentYear]

  const currentTicksAggByWeek = groupBy(ticksForSelectedYear, getWeekNumberFromTick)

  const weeks = eachWeekOfInterval({
    start: new Date(currentYear, 0, 1),
    end: new Date(currentYear, 11, 31)
  }, { weekStartsOn: 1 })

  const daysOfWeek = Array.from(DAYS_OF_WEEK.keys())

  /**
   * Main calculation
   */
  const data: DataProps[] = weeks.reduce<DataProps[]>((acc, curr) => {
    const weekNum = getWeek(curr, { weekStartsOn: 1 })
    const thisWeekTicks = currentTicksAggByWeek[weekNum]
    const thisWeekAgg = groupBy(thisWeekTicks, getDayOfWeekFromTick)
    const week: DataProps[] = daysOfWeek.map(d => {
      const count = thisWeekAgg[d]?.length ?? 0
      return ({
        x: curr.getTime(),
        y: DAYS_OF_WEEK.get(d) ?? '',
        z: count
      })
    })
    return acc.concat(week)
  }, [])

  const renderSquare = (props: ScatterPointProps): ReactElement<SVGElement> => {
    const { cx, cy, xAxis, yAxis, z } = props
    return (
      <rect
        x={cx - xAxis.bandSize / 2 + 2}
        y={cy - yAxis.bandSize / 2 + 2}
        width={xAxis.bandSize - 4}
        height={yAxis.bandSize - 4}
        fill={intensityFn(z)}
        fillOpacity={1}
        rx='3'
      />
    )
  }

  return (
    <div className=''>
      <div className='max-w-screen-lg mx-auto overflow-x-auto'>
        <h3 className='ml-16 py-4'>
          Activity
        </h3>
        <div className='ml-16 flex gap-4 py-6'>
          {years.reverse().map(date => {
            const year = date.getFullYear()
            return (
              <button
                key={year}
                className={classNames('btn btn-sm', year === currentYear ? 'btn-solid' : 'btn-ghost')}
                onClick={() => setYear(year)}
              >{year}
              </button>
            )
          })}
        </div>
        <ResponsiveContainer height={160} width={1000}>
          <ScatterChart margin={{ left: 0, top: 0 }}>
            <XAxis
              type='category'
              allowDuplicatedCategory={false}
              dataKey='x'
              tick={{ fontSize: '14' }}
              tickFormatter={tickFormatScoreToYdsVscale}
              axisLine={false}
              tickLine={false}
              interval={0}
            />

            <YAxis
              type='category'
              dataKey='y'
              allowDuplicatedCategory={false}
              tick={{ fontSize: '12' }}
              domain={Array.from(DAYS_OF_WEEK.values())}
              axisLine={false}
              tickLine={false}
              reversed
              interval='preserveStartEnd'
            />

            <ZAxis dataKey='z' />
            <Tooltip />
            <Scatter data={data} shape={renderSquare} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ActivityHeat

const getYearFromTick = (tick: TickType): number => new Date(tick.dateClimbed).getFullYear()

const getWeekNumberFromTick = (tick: TickType): number => getWeek(tick.dateClimbed)

const getDayOfWeekFromTick = (tick: TickType): number => (new Date(tick.dateClimbed)).getDay()

const DAYS_OF_WEEK = new Map<number, string>()
DAYS_OF_WEEK.set(1, 'Mon')
DAYS_OF_WEEK.set(2, 'Tue')
DAYS_OF_WEEK.set(3, 'Wed')
DAYS_OF_WEEK.set(4, 'Thu')
DAYS_OF_WEEK.set(5, 'Fri')
DAYS_OF_WEEK.set(6, 'Sat')
DAYS_OF_WEEK.set(0, 'Sun')

export const tickFormatScoreToYdsVscale = (value: string): string => {
  if (value == null) return ''
  const d = new Date(value)

  const dayOfMonth = d.getDate()
  const dayOfWeek = d.getDay()

  // only show the first week of the month
  if (dayOfMonth <= 7 && dayOfWeek === 1) return format(d, 'MMM')
  return ''
}

const INTENSITY_GRADIENTS = [
  'rgb(241 245 249)',
  'rgb(251 207 232)',
  'rgb(249 168 212)',
  'rgb(244 114 182)',
  'rgb(236 72 153)',
  'rgb(219 39 119)',
  'rgb(190 24 93)',
  'rgb(157 23 77)'
]

const intensityFn = (count: number): string => {
  if (count < 7) {
    return INTENSITY_GRADIENTS[count]
  }
  return INTENSITY_GRADIENTS[INTENSITY_GRADIENTS.length - 1]
}
