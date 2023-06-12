import * as React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { CountByDisciplineType } from '../../js/types'

interface DisiplineDistributionProps {
  data: CountByDisciplineType
}

export default function DisciplineDistribution (props: DisiplineDistributionProps): JSX.Element {
  const data: Array<{ value: number, label: string }> = Object.keys(props.data)
    .filter(i => i !== '__typename')
    .map(key => { return { value: props.data[key]?.total, label: key } })

  return (
    <ResponsiveContainer>
      <BarChart
        margin={{ top: 0, left: 10, bottom: 0 }}
        layout='vertical'
        data={data}
      >
        <XAxis hide type='number' />
        <YAxis dataKey='label' type='category' />
        <Bar dataKey='value' className='fill-slate-800' />
      </BarChart>
    </ResponsiveContainer>
  )
}
