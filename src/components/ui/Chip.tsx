import React from 'react'
import { ClimbDiscipline } from '../../js/types'

interface ChipProps {
  type: ClimbDiscipline
}

type ChipCSSType = Record<ClimbDiscipline, string>

const ChipType: ChipCSSType = {
  sport: 'border-indigo-400',
  trad: 'border-red-700',
  bouldering: 'border-green-700',
  tr: 'border-yellow-400',
  aid: 'border-gray-600',
  alpine: 'border-gray-600',
  mixed: 'border-gray-600'
}

function Chip ({ type }: ChipProps): JSX.Element {
  return (
    <span
      aria-label='climb-discipline'
      className={`font-extralight font-mono rounded-sm py-1 mr-3 px-2 my-1 text-xs uppercase border-2 ${ChipType[type]}`}
    >
      {type}
    </span>
  )
}

export default Chip
