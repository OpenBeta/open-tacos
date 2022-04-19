import React from 'react'
import { ClimbDisciplineRecord } from '../../js/types'
import Chip from './Chip'

interface ChipProps {
  type: ClimbDisciplineRecord
}
function RouteTypeChips ({ type }: ChipProps): JSX.Element {
  return (
    <div className='flex flex-wrap'>
      {type?.trad && <Chip type='trad' />}
      {type?.sport && <Chip type='sport' />}
      {type?.tr && <Chip type='tr' />}
      {type?.bouldering && <Chip type='bouldering' />}
      {type?.aid && <Chip type='aid' />}
      {type?.mixed && <Chip type='mixed' />}
      {type?.alpine && <Chip type='alpine' />}
    </div>
  )
}

export default RouteTypeChips
