import React from 'react'
import { ClimbDiscipline, ClimbDisciplineRecord } from '../../js/types'
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

export function getSetTypes (type: ClimbDisciplineRecord): ClimbDiscipline[] {
  const set: ClimbDiscipline[] = []
  if (type?.trad) { set.push('trad') }
  if (type?.sport) { set.push('sport') }
  if (type?.tr) { set.push('tr') }
  if (type?.bouldering) { set.push('bouldering') }
  if (type?.aid) { set.push('aid') }
  if (type?.mixed) { set.push('mixed') }
  if (type?.alpine) { set.push('alpine') }
  return set
}

export default RouteTypeChips
