import { render, screen } from '@testing-library/react'

import DifficultyPyramid, { createDifficultyPyramidData, vScale, ydsScale } from '../DifficultyPyramid'
import { TickType } from '../../../js/types'

jest.mock('recharts', () => {
  const React = jest.requireActual<typeof import('react')>('react')
  const actual = jest.requireActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactElement }) => React.cloneElement(children, { width: 500, height: 300 })
  }
})

const getYdsScale = (): NonNullable<typeof ydsScale> => {
  if (ydsScale == null) throw new Error('YDS scale is unavailable')
  return ydsScale
}

const getVScale = (): NonNullable<typeof vScale> => {
  if (vScale == null) throw new Error('V-scale is unavailable')
  return vScale
}

const makeTick = (grade: string, id: string): TickType => ({
  _id: id,
  userId: 'user-1',
  name: `Climb ${id}`,
  notes: '',
  climbId: `climb-${id}`,
  style: '',
  attemptType: '',
  dateClimbed: 0,
  grade,
  source: ''
})

describe('createDifficultyPyramidData', () => {
  it('counts YDS grades only and includes the first tick at each grade', () => {
    const ticks = [makeTick('5.10a', 'route-1'), makeTick('5.10a', 'route-2'), makeTick('5.11b', 'route-3')]

    const { chartData, yOffset } = createDifficultyPyramidData(ticks, getYdsScale())

    expect(chartData.map(({ grade, hackRange }) => ({ grade, count: hackRange[0] - yOffset }))).toEqual([
      { grade: '5.10a', count: 2 },
      { grade: '5.11b', count: 1 }
    ])
    expect(yOffset).toBe(2)
  })

  it('counts V-scale grades only and keeps V labels', () => {
    const ticks = [makeTick('V2', 'boulder-1'), makeTick('V3', 'boulder-2')]

    const { chartData, yOffset } = createDifficultyPyramidData(ticks, getVScale())

    expect(chartData.map(({ grade, hackRange }) => ({ grade, count: hackRange[0] - yOffset }))).toEqual([
      { grade: 'V2', count: 1 },
      { grade: 'V3', count: 1 }
    ])
    expect(yOffset).toBe(1)
  })

  it('separates mixed route and bouldering grades by their own scales', () => {
    const ticks = [makeTick('5.10a', 'route-1'), makeTick('V3', 'boulder-1')]

    const routes = createDifficultyPyramidData(ticks, getYdsScale())
    const boulders = createDifficultyPyramidData(ticks, getVScale())

    expect(routes.chartData.map(({ grade }) => grade)).toEqual(['5.10a'])
    expect(boulders.chartData.map(({ grade }) => grade)).toEqual(['V3'])
    expect(routes.chartData[0].hackRange[0] - routes.yOffset).toBe(1)
    expect(boulders.chartData[0].hackRange[0] - boulders.yOffset).toBe(1)
  })

  it('ignores grades unsupported by the selected scale', () => {
    const ticks = [
      makeTick('5.99', 'invalid-route'),
      makeTick('Vbogus', 'invalid-boulder'),
      makeTick('V100', 'invalid-v-number'),
      makeTick('V23', 'invalid-v-grade'),
      makeTick('V2/4', 'invalid-v-range'),
      makeTick('V22+', 'out-of-range-v-plus'),
      makeTick('V00+', 'leading-zero-v-plus'),
      makeTick('V01/2', 'leading-zero-v-range'),
      makeTick('5.16', 'unsupported-yds-range'),
      makeTick('5.16+', 'unsupported-yds-plus'),
      makeTick('5.16b/c', 'unsupported-yds-slash'),
      makeTick('5.16b', 'unscored-yds'),
      makeTick('unknown', 'invalid')
    ]

    expect(createDifficultyPyramidData(ticks, getYdsScale())).toEqual({ chartData: [], yOffset: 0 })
    expect(createDifficultyPyramidData(ticks, getVScale())).toEqual({ chartData: [], yOffset: 0 })
  })

  it('keeps valid V-scale modifiers', () => {
    const { chartData, yOffset } = createDifficultyPyramidData([
      makeTick('V10+', 'boulder-1'),
      makeTick('V2+3', 'boulder-2'),
      makeTick('V2/3', 'boulder-3'),
      makeTick('V2-3', 'boulder-4')
    ], getVScale())

    expect(chartData.map(({ grade, hackRange }) => ({ grade, count: hackRange[0] - yOffset }))).toEqual([
      { grade: 'V2-V3', count: 3 },
      { grade: 'V10-V11', count: 1 }
    ])
  })

  it('keeps real low-end YDS grades while dropping zero-score fallbacks', () => {
    const { chartData } = createDifficultyPyramidData([
      makeTick('5.0', 'valid-low-grade'),
      makeTick('5.16a', 'valid-high-grade'),
      makeTick('5.16b', 'unscored-yds')
    ], getYdsScale())

    expect(chartData.map(({ grade }) => grade)).toEqual(['5.0', '5.16a'])
  })

  it('keeps valid low-end V grades while dropping leading-zero fallbacks', () => {
    const { chartData } = createDifficultyPyramidData([
      makeTick('V0', 'valid-low-grade'),
      makeTick('V00+', 'leading-zero-v-plus')
    ], getVScale())

    expect(chartData.map(({ grade }) => grade)).toEqual(['V0'])
  })

  it('returns an empty pyramid for empty input', () => {
    expect(createDifficultyPyramidData([], getYdsScale())).toEqual({ chartData: [], yOffset: 0 })
    expect(createDifficultyPyramidData([], getVScale())).toEqual({ chartData: [], yOffset: 0 })
  })

  it('does not mutate the input tick array or tick objects', () => {
    const ticks = Object.freeze([
      Object.freeze(makeTick('V3', 'boulder-1')),
      Object.freeze(makeTick('5.10a', 'route-1')),
      Object.freeze(makeTick('5.10a', 'route-2'))
    ]) as unknown as TickType[]
    const before = ticks.map(tick => ({ ...tick }))

    createDifficultyPyramidData(ticks, getYdsScale())
    createDifficultyPyramidData(ticks, getVScale())

    expect(ticks).toEqual(before)
  })

  it('renders separate route and bouldering pyramid headings', () => {
    render(<DifficultyPyramid tickList={[makeTick('5.10a', 'route-1'), makeTick('V3', 'boulder-1')]} />)

    expect(screen.getByRole('heading', { name: 'Route Difficulty Pyramid (YDS)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bouldering Difficulty Pyramid (V-scale)' })).toBeInTheDocument()
  })

  it('omits a chart when there are no ticks for its scale', () => {
    const { rerender } = render(<DifficultyPyramid tickList={[makeTick('5.10a', 'route-1')]} />)
    expect(screen.getByRole('heading', { name: 'Route Difficulty Pyramid (YDS)' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Bouldering Difficulty Pyramid (V-scale)' })).not.toBeInTheDocument()

    rerender(<DifficultyPyramid tickList={[makeTick('V3', 'boulder-1')]} />)
    expect(screen.queryByRole('heading', { name: 'Route Difficulty Pyramid (YDS)' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bouldering Difficulty Pyramid (V-scale)' })).toBeInTheDocument()

    rerender(<DifficultyPyramid tickList={[makeTick('unknown', 'ungraded')]} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('renders a filled bar for a single grade instead of an area with no path', () => {
    const { container } = render(<DifficultyPyramid tickList={[makeTick('V3', 'boulder-1')]} />)

    expect(container.querySelector('.recharts-bar-rectangle path.recharts-rectangle')).toHaveAttribute('d', expect.stringContaining(' h 40 v '))
    expect(container.querySelector('.recharts-area-area')).not.toBeInTheDocument()
  })

  it('keeps an area pyramid when a scale has multiple grades', () => {
    const ticks = [
      makeTick('V2', 'boulder-1'),
      makeTick('V3', 'boulder-2'),
      makeTick('V3', 'boulder-3')
    ]
    const { container } = render(<DifficultyPyramid tickList={ticks} />)

    expect(container.querySelector('.recharts-area-area')).toHaveAttribute('d', expect.stringContaining('Z'))
    expect(container.querySelector('.recharts-bar-rectangle')).not.toBeInTheDocument()
    expect(Array.from(container.querySelectorAll('.recharts-yAxis .recharts-cartesian-axis-tick-value'), tick => tick.textContent)).toContain('2')
  })
})
