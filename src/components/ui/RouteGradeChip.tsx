import React from 'react'
import classNames from 'classnames'
import { SafetyType } from '../../js/types'

interface RouteGradeChipProps {
  gradeStr: string
  safety: SafetyType
  size?: string
}
export default function RouteGradeChip ({ gradeStr, safety, size = Size.md }: RouteGradeChipProps): JSX.Element | null {
  const friendly = gradeStr == null || gradeStr.trim() === '' ? 'UNKNOWN' : gradeStr
  return (
    <span
      title='Route Grade - Click for disambiguation'
      className={
      classNames(
        'rounded border-2 border-base-content cursor-pointer',
        size
      )
      }
    >
      {/* If we eventually provide our own help resources, I think here is a nice one to include */}
      <a href='https://www.sportrock.com/post/understanding-climbing-grades' target='blank'>
        {friendly}
        {safety != null && safety !== SafetyType.UNSPECIFIED && ` ${safety}`}
      </a>
    </span>
  )
}
const Size = {
  sm: 'text-xs px-1',
  md: 'text-md px-3 py-0.5'
}

RouteGradeChip.Size = Size
