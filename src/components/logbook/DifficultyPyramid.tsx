import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getScale } from '@openbeta/sandbag'

import { TickType } from '../../js/types'
import { maxSorted } from 'simple-statistics'
/**
   * Assume grades are YDS or Vscale for now since we don't store
   * grade context with ticks, nor do we have a way to get score
   *  without knowing the grade system
   */
export const ydsScale = getScale('yds')
export const vScale = getScale('vscale')

interface DifficultyPyramidProps {
  tickList: TickType[]
}

const DifficultyPyramid: React.FC<DifficultyPyramidProps> = ({ tickList }) => {
  const gradeHistogram = new Map<number, number>()

  if (tickList == null || tickList.length < 1) return null

  tickList.forEach((tick) => {
    const score = getScoreUSAForRouteAndBoulder(tick.grade)
    if (score > 0) {
      const count = gradeHistogram.get(score)
      if (count == null) {
        gradeHistogram.set(score, 0)
      } else {
        gradeHistogram.set(score, count + 1)
      }
    }
  })

  const sortedKeys = Array.from(gradeHistogram.keys()).sort((a, b) => a - b)
  const sortedValues = Array.from(gradeHistogram.values()).sort((a, b) => a - b)
  const yOffset = maxSorted(sortedValues)

  const chartData = sortedKeys.map(key => {
    const value = gradeHistogram.get(key) ?? 0
    return ({
      x: key,
      xBottom: key,
      hackRange: [value + yOffset, -value + yOffset]
    })
  })
  return (
    <div className='w-full'>
      <h3 className='ml-16 py-4'>
        Difficulty Pyramid
      </h3>
      <ResponsiveContainer height={300}>
        <AreaChart data={chartData} margin={{ right: 80 }}>
          <CartesianGrid stroke='#f5f5f5' />

          <XAxis
            orientation='bottom'
            dataKey='xBottom'
            tick={{ fontSize: '10' }}
            tickFormatter={tickFormatScoreToYdsVscale}
          />

          <YAxis
            tickFormatter={(value) => {
              const actual = parseInt(value) - yOffset
              return `${actual > 0 ? actual : ''}`
            }}
          />

          <Area type='step' stroke='none' dataKey='hackRange' fillOpacity={1} fill='rgb(6 182 212)' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DifficultyPyramid

const getScoreUSAForRouteAndBoulder = (grade: string): number => {
  let score = ydsScale?.getScore(grade)[0] as number ?? -1
  if (score < 0) {
    score = vScale?.getScore(grade)[0] as number ?? -1
  }
  return score
}

export const tickFormatScoreToYdsVscale = (value: string): string => {
  if (value == null) return ''
  const yds = ydsScale?.getGrade(parseInt(value)) ?? ''
  const vscale = vScale?.getGrade(parseInt(value)) ?? ''
  return `${yds}/${vscale}`
}
