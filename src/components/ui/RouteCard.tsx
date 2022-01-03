import React from 'react'
import Card from './card'
import RouteTypeChips from './RouteTypeChips'
import RouteGradeGip from './RouteGradeChip'
import { ClimbDisciplineRecord, SafetyType } from '../../js/types'

interface RouteCardProps {
  routeName: string
  type: ClimbDisciplineRecord
  safety?: SafetyType
  yds: string
  onPress: (e) => void
}

function RouteCard ({ routeName, type, safety, yds, onPress }: RouteCardProps): JSX.Element {
  return (
    <Card
      footer=''
      onPress={onPress}
    >
      <h2
        className='font-medium font-sans my-4 text-base truncate'
      >
        {routeName}
      </h2>
      <div className='mt-4 flex justify-between items-center'>
        <div>
          <RouteGradeGip yds={yds} safety={safety} />
          <RouteTypeChips type={type} />
        </div>
      </div>
    </Card>
  )
}

export default RouteCard
