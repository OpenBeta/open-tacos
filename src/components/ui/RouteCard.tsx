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
  fa?: string
}

function RouteCard ({ routeName, type, safety, yds, fa = '' }: RouteCardProps): JSX.Element {
  return (
    <Card>
      <h2
        className='font-medium font-sans my-2 text-base truncate'
      >
        {routeName}
      </h2>
      {fa !== null ? (<div className='text-xs font-light text-slate-500'>{fa}</div>) : null}
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
