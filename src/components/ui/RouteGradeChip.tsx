import React from 'react'
import classNames from 'classnames'
import { SafetyType } from '../../js/types'

interface RouteGradeChipProps {
  grade: string
  safety: SafetyType
  size?: string
}
export default function RouteGradeChip ({ grade, safety, size = Size.md }: RouteGradeChipProps): JSX.Element {
  const gradeStr = grade === 'NaN' ? 'Unknown' : grade
  return (
    <span
      title='Route Grade - Click for disambiguation'
      className={
      classNames(
        'rounded border-2 border-gray-900 text-gray-900 cursor-pointer',
        size
      )
      }
    >
      {/* If we eventually provide our own help resources, I think here is a nice one to include */}
      <a href='https://www.sportrock.com/post/understanding-climbing-grades' target='blank'>
        {gradeStr}
        {safety !== undefined && safety !== SafetyType.UNSPECIFIED && ` ${safety}`}
      </a>
    </span>
  )
}
const Size = {
  sm: 'text-xs px-1',
  md: 'text-md px-3 py-0.5'
}

RouteGradeChip.Size = Size
