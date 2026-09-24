import { ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getScale } from '@openbeta/sandbag'

import { TickType } from '../../js/types'

export const ydsScale = getScale('yds')
export const vScale = getScale('vscale')

export interface DifficultyPyramidPoint {
  x: number
  xBottom: number
  grade: string
  hackRange: [number, number]
}

export interface DifficultyPyramidData {
  chartData: DifficultyPyramidPoint[]
  yOffset: number
}

type GradeScale = NonNullable<ReturnType<typeof getScale>>

const isValidVScaleGrade = (grade: string): boolean => {
  const match = grade.match(/^V(0|[1-9]\d?)(?:([+-])|([+/-])(0|[1-9]\d?))?$/i)
  if (match == null) return /^VB[+-]?$/i.test(grade)

  const gradeNumber = Number(match[1])
  const nextGradeNumber = match[4] == null ? undefined : Number(match[4])
  if (gradeNumber > 22) return false
  if (nextGradeNumber != null && (nextGradeNumber > 22 || nextGradeNumber !== gradeNumber + 1)) return false
  return !(gradeNumber === 22 && match[2] === '+')
}

/** Build a histogram using only grades recognized by the supplied scale. */
export const createDifficultyPyramidData = (tickList: TickType[], scale: GradeScale): DifficultyPyramidData => {
  const gradeHistogram = new Map<number, { count: number, grade: string }>()

  tickList.forEach((tick) => {
    if (typeof tick.grade !== 'string' || !scale.isType(tick.grade)) return
    if (scale.name === 'vscale' && !isValidVScaleGrade(tick.grade)) return

    let scoreResult: number | [number, number]
    try {
      scoreResult = scale.getScore(tick.grade)
    } catch {
      return
    }
    // Sandbag also returns a positive-midpoint [0, 5] fallback for unsupported grades.
    // The supported YDS 5.0 is the one grade whose real score range begins at zero.
    if (Array.isArray(scoreResult) && scoreResult[0] <= 0 && !(scale.name === 'yds' && tick.grade === '5.0')) return

    const score = Array.isArray(scoreResult)
      ? (scoreResult[0] + scoreResult[1]) / 2
      : scoreResult

    // Sandbag uses zero for some grades its regex accepts but its table cannot score.
    if (!Number.isFinite(score) || score <= 0) return

    // A grade's first tick is already one climb in its histogram.
    const current = gradeHistogram.get(score)
    gradeHistogram.set(score, {
      count: (current?.count ?? 0) + 1,
      grade: current?.grade ?? scale.getGrade(scoreResult)
    })
  })

  const yOffset = Math.max(0, ...Array.from(gradeHistogram.values(), ({ count }) => count))
  const chartData = Array.from(gradeHistogram.entries())
    .sort(([scoreA], [scoreB]) => scoreA - scoreB)
    .map(([score, { count, grade }]) => ({
      x: score,
      xBottom: score,
      grade,
      hackRange: [count + yOffset, -count + yOffset] as [number, number]
    }))

  return { chartData, yOffset }
}

interface DifficultyPyramidProps {
  tickList: TickType[]
}

interface DifficultyPyramidChartProps {
  data: DifficultyPyramidData
  scale: GradeScale
  title: string
}

const DifficultyPyramidChart: React.FC<DifficultyPyramidChartProps> = ({ data, scale, title }) => {
  const { chartData, yOffset } = data

  return (
    <div className='w-full'>
      <h3 className='ml-16 py-4'>
        {title}
      </h3>
      <ResponsiveContainer height={300}>
        <ComposedChart data={chartData} margin={{ right: 80 }}>
          <CartesianGrid stroke='#f5f5f5' />

          <XAxis
            orientation='bottom'
            dataKey='xBottom'
            tick={{ fontSize: '10' }}
            tickFormatter={(value) => {
              const score = Number(value)
              return chartData.find(point => point.x === score)?.grade ?? scale.getGrade(Math.ceil(score))
            }}
          />

          <YAxis
            domain={[0, yOffset * 2]}
            tickFormatter={(value) => {
              const actual = parseInt(value) - yOffset
              return `${actual > 0 ? actual : ''}`
            }}
          />

          {chartData.length === 1
            ? <Bar dataKey='hackRange' barSize={40} fill='rgb(6 182 212)' isAnimationActive={false} />
            : <Area type='step' stroke='none' dataKey='hackRange' fillOpacity={1} fill='rgb(6 182 212)' />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const DifficultyPyramid: React.FC<DifficultyPyramidProps> = ({ tickList }) => {
  if (tickList == null || tickList.length < 1) return null

  const routeData = ydsScale == null ? null : createDifficultyPyramidData(tickList, ydsScale)
  const boulderData = vScale == null ? null : createDifficultyPyramidData(tickList, vScale)
  if ((routeData?.chartData.length ?? 0) === 0 && (boulderData?.chartData.length ?? 0) === 0) return null

  return (
    <div className='flex flex-col gap-6'>
      {ydsScale != null && routeData != null && routeData.chartData.length > 0 && (
        <DifficultyPyramidChart data={routeData} scale={ydsScale} title='Route Difficulty Pyramid (YDS)' />
      )}
      {vScale != null && boulderData != null && boulderData.chartData.length > 0 && (
        <DifficultyPyramidChart data={boulderData} scale={vScale} title='Bouldering Difficulty Pyramid (V-scale)' />
      )}
    </div>
  )
}

export default DifficultyPyramid

/** Kept for the Climb History chart, which still combines its two scales. */
export const tickFormatScoreToYdsVscale = (value: string): string => {
  if (value == null) return ''
  const yds = ydsScale?.getGrade(parseInt(value)) ?? ''
  const vscale = vScale?.getGrade(parseInt(value)) ?? ''
  return `${yds}/${vscale}`
}
