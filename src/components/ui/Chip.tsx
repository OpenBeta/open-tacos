import React from 'react'
import classNames from 'classnames'
import { ClimbDiscipline } from '../../js/types'

interface ChipProps {
  type: ClimbDiscipline
  size?: string
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

export default function Chip ({ type, size }: ChipProps): JSX.Element {
  return (
    <span
      aria-label='climb-discipline'
      className={
        classNames(
          'font-extralight rounded-sm uppercase',
          ChipType[type],
          size === 'sm' ? 'text-xs border px-1' : 'border-2 text-sm py-0.5 px-2'
        )
      }
    >
      {type}
    </span>
  )
}
