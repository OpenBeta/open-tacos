import React from 'react'
import { ClimbDisciplineRecord } from '../../js/types'
import Chip from './Chip'

interface ChipProps {
  type: Partial<ClimbDisciplineRecord>
  size?: string
}
export default function RouteTypeChips ({ type, size = 'md' }: ChipProps): JSX.Element {
  return (
    <div className='inline-flex flex-wrap items-center space-x-0.5'>
      {(type?.trad ?? false) && <Chip type='trad' size={size} />}
      {(type?.sport ?? false) && <Chip type='sport' size={size} />}
      {(type?.tr ?? false) && <Chip type='tr' size={size} />}
      {(type?.bouldering ?? false) && <Chip type='bouldering' size={size} />}
      {(type?.aid ?? false) && <Chip type='aid' size={size} />}
      {(type?.mixed ?? false) && <Chip type='mixed' size={size} />}
      {(type?.alpine ?? false) && <Chip type='alpine' size={size} />}
    </div>
  )
}
