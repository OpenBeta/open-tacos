import React from 'react'
import Card from './Card'
import RouteTypeChips from './RouteTypeChips'
import RouteGradeChip from './RouteGradeChip'
import { MiniCrumbs } from './BreadCrumbs'
import { ClimbDisciplineRecord, SafetyType } from '../../js/types'

interface RouteCardProps {
  routeName: string
  type: Partial<ClimbDisciplineRecord>
  safety?: SafetyType
  yds: string
  fa?: string
  pathTokens?: string[]
}

function RouteCard ({ routeName, type, safety, yds, fa = '', pathTokens }: RouteCardProps): JSX.Element {
  return (
    <Card>
      <div className='flex flex-col'>
        <div>{pathTokens !== undefined && <MiniCrumbs pathTokens={pathTokens} />}</div>
        <h3
          className='font-bold font-sans my-2 text-base lg:text-lg truncate'
        >
          {routeName}
        </h3>
      </div>
      {fa !== null && (<div className='text-xs font-light text-slate-500'>{fa}</div>)}
      <div className='mt-4 flex justify-between items-center'>
        {safety != null && <RouteGradeChip gradeStr={yds} safety={safety} />}
      </div>
      <div className='mt-4 flex justify-between items-center'>
        <RouteTypeChips type={type} />
      </div>
    </Card>
  )
}

export default RouteCard
