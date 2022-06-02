import React from 'react'
import classNames from 'classnames'
import { ClimbDiscipline } from '../../js/types'

interface ChipProps {
  type: ClimbDiscipline
  size?: string
}

// type ChipCSSType = Record<ClimbDiscipline, string>
// const ChipType: ChipCSSType = {
//   sport: 'border-indigo-400',
//   trad: 'border-red-700',
//   bouldering: 'border-green-700',
//   tr: 'border-yellow-400',
//   aid: 'border-gray-600',
//   alpine: 'border-gray-600',
//   mixed: 'border-gray-600'
// }

/*
When some kind of help-resource directory becomes available,
this is what we should wrap {type} in:

 <a href={`/help/discipline#${type}`} target='blank'>
  {type}
 </a>
*/

export default function Chip ({ type, size }: ChipProps): JSX.Element {
  return (
    <span
      title={`Discipline: ${type} - Click for disambiguation`}
      aria-label='climb-discipline'
      className={
        classNames(
          'cursor-pointer',
          'uppercase rounded border-2 border-gray-900 text-gray-900 px-3 py-0.5'
          // ChipType[type],
          // size === 'sm' ? 'text-sm px-1' : 'py-0.5 px-2'
        )
      }
    >
      <a href='https://www.nicas.co.uk/about/types-of-climbing' target='blank'>
        {type}
      </a>
    </span>
  )
}
