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
    <span className={
      classNames(
        'text-white bg-gray-700 rounded-sm',
        size
      )
      }
    >
      {gradeStr}
      {safety !== undefined && safety !== SafetyType.UNSPECIFIED && ` ${safety}`}
    </span>
  )
}
const Size = {
  sm: 'text-xs px-1',
  md: 'text-md px-2 py-0.5'
}

RouteGradeChip.Size = Size
