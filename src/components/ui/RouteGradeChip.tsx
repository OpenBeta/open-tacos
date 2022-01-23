import React from 'react'
import { SafetyType } from '../../js/types'

function RouteGradeChip ({ yds, safety }: { yds: string, safety: SafetyType }): JSX.Element {
  const grade = yds === 'NaN' ? 'Unknown' : yds
  return (
    <span className='text-sm text-white font-mono bg-gray-700 rounded-sm py-1.5 px-2 mr-4'>
      {grade}
      {safety !== undefined && safety !== SafetyType.UNSPECIFIED && ` ${safety}`}
    </span>
  )
}

export default RouteGradeChip
