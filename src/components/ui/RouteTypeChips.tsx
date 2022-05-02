import React from 'react'
import { ClimbDisciplineRecord } from '../../js/types'
import Chip from './Chip'

interface ChipProps {
  type: ClimbDisciplineRecord
  size?: string
}
export default function RouteTypeChips ({ type, size = 'md' }: ChipProps): JSX.Element {
  return (
    <div className='inline-flex flex-wrap items-center space-x-0.5'>
      {type?.trad && <Chip type='trad' size={size} />}
      {type?.sport && <Chip type='sport' size={size} />}
      {type?.tr && <Chip type='tr' size={size} />}
      {type?.bouldering && <Chip type='bouldering' size={size} />}
      {type?.aid && <Chip type='aid' size={size} />}
      {type?.mixed && <Chip type='mixed' size={size} />}
      {type?.alpine && <Chip type='alpine' size={size} />}
    </div>
  )
}
