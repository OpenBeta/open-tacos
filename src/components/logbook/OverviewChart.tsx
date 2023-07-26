import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Bar, Line,
  Tooltip, LineProps, Brush
} from 'recharts'
import { groupBy } from 'underscore'
import { lastDayOfMonth, format } from 'date-fns'
import { linearRegression, linearRegressionLine, minSorted, maxSorted, medianSorted } from 'simple-statistics'

import { TickType } from '../../js/types'
import { ydsScale, vScale, tickFormatScoreToYdsVscale } from './DifficultyPyramid'

export interface OverviewChartProps {
  tickList: TickType[]
}

/**
 * Proof of concept chart showing climbs aggregated by a time interval
 */
const OverviewChart: React.FC<OverviewChartProps> = ({ tickList }) => {
  if (tickList == null || tickList.length < 1) return null

  const agg = groupBy(tickList, getYearMonthFromDate)

  const xyRegressionData: number[][] = []

  const chartData: ChartDataPayloadProps[] = Object.entries(agg).map(value => {
    const x = parseInt(value[0])
    const gradeScores = value[1].reduce<number[]>((acc, curr) => {
      // @ts-expect-error
      let score = ydsScale?.getScore(curr.grade)?.[0] as number ?? -1

      if (score < 0) {
        // @ts-expect-error
        score = vScale?.getScore(curr.grade)[0] as number ?? -1
      }
      if (score > 0) {
        acc.push(score)
      }
      return acc
    }, [])

    const gradeScoresSorted = gradeScores.sort((a, b) => a - b)
    let medianScore = -1
    if (gradeScores.length > 0) {
      medianScore = medianSorted(gradeScoresSorted)
      xyRegressionData.push([x, medianScore])
    }
    return {
      date: x,
      total: value[1].length,
      score: medianScore,
      low: minSorted(gradeScoresSorted),
      high: maxSorted(gradeScoresSorted)
    }
  })

  const linearFn = linearRegressionLine(linearRegression(xyRegressionData))

  const chartData2 = chartData.reduce<ChartDataPayloadProps[]>((acc, curr) => {
    if (curr.score > 0) {
      acc.push({
        ...curr,
        linearReg: linearFn(curr.date)
      })
    }
    return acc
  }, [])

  return (
    <div className='w-full'>
      <h3 className='ml-16 py-4'>
        Climb History
      </h3>
      <ResponsiveContainer height={350}>
        <ComposedChart
          data={chartData2}
          syncId='overviewChart'
          margin={{ left: 0, right: 0 }}
        >
          <CartesianGrid stroke='#f5f5f5' />
          <YAxis
            yAxisId='score' stroke='rgb(15 23 42)' tick={{ fontSize: '10' }} tickFormatter={tickFormatScoreToYdsVscale}
          />

          <Line
            yAxisId='score' type='monotone' dataKey='score' stroke='none' dot={<CustomizeMedianDot />}
            isAnimationActive={false}
          />

          <Line
            yAxisId='score' type='monotone' dataKey='low' stroke='rgb(15 23 42)'
            opacity={0.5} dot={{
              display: 'none'
            }}
            isAnimationActive={false}
          />
          <Line
            yAxisId='score' type='natural' dataKey='high' stroke='rgb(15 23 42)'
            opacity={0.5}
            dot={{
              display: 'none'
            }}
            isAnimationActive={false}
          />

          <Line
            yAxisId='score' type='monotone' dataKey='linearReg'
            stroke='rgb(239 68 68)'
            strokeWidth={2}
            strokeDasharray='2, 5'
            dot={{
              display: 'none'
            }}
            isAnimationActive={false}
          />

          <XAxis dataKey='date' tick={{ fontSize: '10' }} tickFormatter={xAxisFormatter} />

          <Bar
            yAxisId='total' dataKey='total' fill='rgb(7 89 133)' opacity={0.15} spacing={5}
          />

          <YAxis
            yAxisId='total' orientation='right' fill='rgb(7 89 133)' opacity={0.45} type='number'
            domain={[0, 'dataMax + 20']}
          />

          <Tooltip offset={30} content={<CustomTooltip />} />

          <Brush
            dataKey='date' height={30} stroke='#8884d8' tickFormatter={(value) => {
              return format(value, 'MMM yyyy')
            }}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OverviewChart

const getYearMonthFromDate = (tick: TickType): number => lastDayOfMonth(tick.dateClimbed).getTime()

const xAxisFormatter = (data: any): any => {
  return format(data, 'MMM yy')
}

/**
 * Make median score looks like a candle stick
 */
const CustomizeMedianDot: React.FC<LineProps & { payload?: ChartDataPayloadProps}> = (props) => {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || payload == null) return null
  const lengthOffset = payload.total * 1.2
  return (
    <>
      <line
        x1={cx} y1={cy as number - lengthOffset} x2={cx} y2={cy as number + lengthOffset}
        stroke='rgb(190 24 93)'
        strokeWidth={6}
        strokeLinecap='round'
      />
      <line
        x1={cx as number - 6} y1={cy} x2={cx as number + 6} y2={cy}
        stroke='rgb(15 23 42)'
        strokeWidth={2}
      />
    </>
  )
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active === true && payload != null && payload.length > 0) {
    return (
      <div className='bg-info p-4 rounded-btn'>
        <div>Total climbs: <span className='font-semibold'>{payload[4].value}</span></div>
        <div>Median: {tickFormatScoreToYdsVscale(payload[0].value)}</div>
        <div>Low: {tickFormatScoreToYdsVscale(payload[1].value)}</div>
        <div>High: {tickFormatScoreToYdsVscale(payload[2].value)}</div>
      </div>
    )
  }

  return null
}

interface ChartDataPayloadProps {
  date: number
  total: number
  score: number
  low: number
  high: number
  linearReg?: number
}
