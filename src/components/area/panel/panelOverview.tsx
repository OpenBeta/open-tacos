import * as React from 'react'
import { ListItemEntity } from './listItem'
import { BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'

const CustomTooltip = (data: {label: string, payload: any[] }): JSX.Element => {
  let tags: Array<[string, number]> = []

  if (data.payload.length > 0) {
    const details = data.payload[0].payload.details
    tags = Object.keys(details)
      .map(key => [key, details[key]])
  }

  return (
    <div className='bg-white p-2 rounded border border-slate-700'>
      <h5>{data.label}</h5>
      <table>
        <tbody>
          {tags.map(r => (
            <tr key={r[0]}>
              <td>{r[0]}</td>
              <td className='pl-4'>{r[1]}</td>
            </tr>))}
        </tbody>
      </table>
    </div>
  )
}

interface PanelOverviewProps {
  items: ListItemEntity[]
  onSelect: (id: string) => void
  onFocus: (id: string) => void
  focused: string | null
  selected: string | null
}

export default function PanelOverview (props: PanelOverviewProps): JSX.Element {
  const data = props.items.filter(i => i.totalClimbs > 1).map(item => {
    return {
      name: item.name,
      total: item.totalClimbs,
      id: item.id,
      details: {
        beginner: item.aggregate.byGradeBand.beginner,
        intermediate: item.aggregate.byGradeBand.intermediate,
        advance: item.aggregate.byGradeBand.advance,
        expert: item.aggregate.byGradeBand.expert
      }
    }
  })

  function handleClick (data: CategoricalChartState): void {
    if (data === undefined || data === null) {
      return
    }
    if (data.activePayload === undefined) {
      return
    }
    if (data.activePayload.length === 0) {
      return
    }
    const id = data.activePayload[0].payload.id

    props.onSelect(id)
  }

  function handleHover (data: CategoricalChartState): void {
    if (data === undefined) {
      return
    }
    if (data.activePayload === undefined) {
      return
    }
    if (data.activePayload.length === 0) {
      return
    }
    const id = data.activePayload[0].payload.id
    if (id === props.focused) {
      return
    }

    props.onFocus(id)
  }

  return (
    <div className='w-full' style={{ height: '5rem' }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          onClick={handleClick}
          onMouseMove={handleHover}
        >
          <Tooltip content={CustomTooltip} isAnimationActive={false} />
          <XAxis hide dataKey='name' />
          <Bar
            dataKey='total'
            className='fill-slate-800 cursor-pointer hover:fill-slate-700'
          >
            {data.map((entry) => (
              <Cell
                key={entry.id}
                className={`${entry.id === props.focused ? 'fill-green-500' : 'fill-slate-800'}
                 ${entry.id === props.selected ? 'fill-violet-500' : 'fill-slate-800'}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
