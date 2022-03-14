import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export interface CounterPieProps {
  total: number
  forYou: number
}

const CounterPie = ({ total, forYou }: CounterPieProps): JSX.Element => {
  const data = [
    { name: 'total', value: total },
    { name: 'forYou', value: forYou }
  ]
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius='60%'
          outerRadius='80%'
          startAngle={90}
          endAngle={450}
          fill='#000000'
          dataKey='value'
          paddingAngle={5}
          isAnimationActive={false}
        >
          <Cell key='total' fill='#D1D5DB' />
        </Pie>
        <g>
          <text x='50%' y='50%' fontSize='1.25rem' textAnchor='middle' alignmentBaseline='middle' fill='#000000'>
            {forYou}
          </text>
        </g>
      </PieChart>
    </ResponsiveContainer>
  )
}

// const renderCustomizedLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   percent,
//   index
// }: any) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5
//   // const x = cx + radius * Math.cos(-midAngle * RADIAN)
//   // const y = cy + radius * Math.sin(-midAngle * RADIAN)

//   if (index === 0) return null
//   console.log('label', index)
//   return (
//     <text
//       x={cx}
//       y={cy}
//       // fill='white'
//       // textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline='central'
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   )
// }

export default CounterPie
