import React from 'react'
import Card from './Card'
import BarPercent from './BarPercent'
import { sanitizeName } from '../../js/utils'

/**
 * area_name - A string of the climbing areas name
 * onPress - callback function for when the card is clicked
 * stats - {percent, colors} an object that contains the data for the BarPercent
 *   component
 */
interface AreaStatistics {
  percents: number[]
  colors: string[]
}

interface AreaCardProps {
  areaName: string
  stats?: AreaStatistics
}

function AreaCard ({ areaName, stats }: AreaCardProps): JSX.Element {
  return (
    <Card
      footer={
        (stats != null) &&
          <BarPercent styles='-mt-2' percents={stats.percents} colors={stats.colors} />
      }
    >
      <h3 className='font-medium font-sans my-4 text-base truncate'>
        {sanitizeName(areaName)}
      </h3>
    </Card>
  )
}

export default AreaCard
