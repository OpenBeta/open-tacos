import { useState, useMemo } from 'react'
import { ResponsiveContainer, BarChart, XAxis, YAxis, ZAxis, Tooltip, Bar, ScatterChart, Scatter } from 'recharts'
import { groupBy } from 'underscore'
import { getWeekOfMonth, startOfMonth, format, eachYearOfInterval, eachWeekOfInterval } from 'date-fns'
import classNames from 'classnames'

import { ChartsSectionProps } from './ChartsSection'
import { TickType } from '../../js/types'

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

  const currentTicks = aggByYear[currentYear]

  // console.log('#', aggByYear[currentYear])

  const weeks = eachWeekOfInterval({
    start: new Date(currentYear, 0, 1),
    end: new Date(currentYear, 11, 31)
  }, { weekStartsOn: 1 })

  const daysOfWeek = Array.from(DAYS_OF_WEEK.values())

  const data = weeks.reduce((acc, curr) => {
    const week = daysOfWeek.map(d => (
      {
        x: curr.getTime(),
        y: d,
        z: 1
      }))
    return acc.concat(week)
  }, [])

  const CustomShape = (props) => {
    const { fill, x, y, width, height } = props
    return <rect x={x} y={y + 4} width={width} height={width} fill='#c0c0c0' />
  }

  const renderSquare = (props: any) => {
    const { cx, cy, size, xAxis, yAxis, zAxis } = props
    const xBandSize = xAxis.bandSize
    const yBandSize = yAxis.bandSize

    // console.log('##', props)
    return (
      <rect
        x={cx - xAxis.bandSize / 2 + 2}
        y={cy - yAxis.bandSize / 2 + 2}
        width={xAxis.bandSize - 4}
        height={yAxis.bandSize - 4}
        fill='#c0c0c0'
        // fill='red'
        fillOpacity={0.5}
        rx='2'
      />
    )
  }

  return (
    <div>
      <div className='w-full'>
        <h3 className='ml-16 py-4'>
          Activity
        </h3>
        <div className='mr-16 flex gap-4 justify-end'>
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
          <ScatterChart margin={{ left: 0, top: 0, right: 0 }}>
            <XAxis
              type='category'
              allowDuplicatedCategory={false}
              dataKey='x'
              tick={{ fontSize: '12' }}
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
              domain={daysOfWeek}
              axisLine={false}
              tickLine={false}
              reversed
              interval='preserveStartEnd'
            />

            <ZAxis
              dataKey='z'
              // type='number'
              // tickFormatter={tickFormatScoreToYdsVscale}
              // domain={[1, 2, 3, 4, 5, 6, 7]}
            />
            <Tooltip />
            <Scatter data={data} fill='#8884d8' shape={renderSquare} />

            {/* <Bar dataKey='0' stackId='a' shape={CustomShape} />
            <Bar dataKey='1' stackId='a' shape={CustomShape} />
            <Bar dataKey='2' stackId='a' shape={CustomShape} />
            <Bar dataKey='3' stackId='a' shape={CustomShape} />
            <Bar dataKey='4' stackId='a' shape={CustomShape} />
            <Bar dataKey='5' stackId='a' shape={CustomShape} />
            <Bar dataKey='6' stackId='a' shape={renderSquare} /> */}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ActivityHeat

const getYearFromTick = (tick: TickType): number => new Date(tick.dateClimbed).getFullYear()

const DAYS_OF_WEEK = new Map<number, string>()
DAYS_OF_WEEK.set(1, 'Mon')
DAYS_OF_WEEK.set(2, 'Tue')
DAYS_OF_WEEK.set(3, 'Wed')
DAYS_OF_WEEK.set(4, 'Thu')
DAYS_OF_WEEK.set(5, 'Fri')
DAYS_OF_WEEK.set(6, 'Sat')
DAYS_OF_WEEK.set(0, 'Sun')

// export const tickFormatDoW = (value: string): string => {
//   return DAYS_OF_WEEK?.[value] ?? ''
// }

export const tickFormatScoreToYdsVscale = (value: string): string => {
  if (value == null) return ''
  const d = new Date(value)
  const weekIndex = getWeekOfMonth(d)

  const first_week = d.getDate()
  const the_day = d.getDay()

  if (first_week <= 7 && the_day === 0) return format(d, 'MMM')

  // console.log('#', d, weekIndex)
  return ''
}
