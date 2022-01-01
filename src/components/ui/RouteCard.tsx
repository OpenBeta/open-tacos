import React from 'react'
import Card from './card'
import RouteTypeChips from './RouteTypeChips'
import RouteGradeGip from './RouteGradeChip'
import { ClimbType } from '../../js/types'

interface RouteCardProps {
  routeName: string,
  type: ClimbType,
  safety: unknown, YDS: string, onPress: (e) => void
}
 
function RouteCard({ routeName, type, safety, YDS, onPress }: RouteCardProps):JSX.Element {
  return (
    <Card
      footer=""
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
