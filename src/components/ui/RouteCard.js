import React from 'react'
import Card from './card'
import RouteTypeChips from './RouteTypeChips'
import RouteGradeGip from './RouteGradeChip'

function RouteCard ({ routeName, type, safety, YDS, onPress }) {
  return (
    <Card
      onPress={onPress}
    >
      <h2
        className='font-medium font-sans my-4 text-base truncate'
      >
        {routeName}
      </h2>
      <div className='mt-4 flex justify-between items-center'>
        <div>
          <RouteGradeGip yds={YDS} safety={safety} />
          <RouteTypeChips type={type} />
        </div>
      </div>
    </Card>
  )
}

export default RouteCard
