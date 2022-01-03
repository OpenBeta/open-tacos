import React from 'react'
import Card from './Card'
import RouteTypeChips from './RouteTypeChips'
import RouteGradeGip from './RouteGradeChip'
import { ClimbDisciplineRecord, SafetyType } from '../../js/types'

interface RouteCardProps {
  routeName: string
  type: ClimbDisciplineRecord
  safety?: SafetyType
  yds: string
}

function RouteCard ({ routeName, type, safety, yds }: RouteCardProps): JSX.Element {
  return (
    <Card>
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
