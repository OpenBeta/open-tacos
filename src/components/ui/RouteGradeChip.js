import React from 'react'

function RouteGradeChip ({ yds, safety }) {
  return (
    <span className='text-sm text-white font-mono bg-gray-700 rounded-sm py-1.5 px-2 mr-4'>
      {yds}
      {safety && ` ${safety}`}
    </span>
  )
}

export default RouteGradeChip
