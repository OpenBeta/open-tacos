import React from 'react'
import Card from './card'
import BarPercent from './BarPercent'

/**
 * area_name - A string of the climbing areas name
 * onPress - callback function for when the card is clicked
 * stats - {percent, colors} an object that contains the data for the BarPercent
 *   component
 */
function AreaCard ({ area_name, onPress, stats }) {
  return (
    <Card
      onPress={onPress}
      footer={
        stats &&
          <BarPercent styles='-mt-2' percents={stats.percents} colors={stats.colors} />
      }
    >
      <h2
        className='font-medium font-sans my-4 text-base truncate'
      >
        {area_name}
      </h2>
    </Card>
  )
}

export default AreaCard
