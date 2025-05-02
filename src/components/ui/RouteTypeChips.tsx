import React from 'react'
import { ClimbDiscipline } from '../../js/types'
import Chip from './Chip'

interface ChipProps {
  types: ClimbDiscipline[]
  size?: string
}
export default function RouteTypeChips ({ types, size = 'md' }: ChipProps): JSX.Element {
  return (
    <div className='inline-flex flex-wrap items-center space-x-0.5'>
      {types.map(discipline => {
        return <Chip key={discipline} type={discipline} size={size} />
      })}
    </div>
  )
}
