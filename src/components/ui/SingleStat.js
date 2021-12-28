import React from 'react'

function SingleStat ({ number, className }) {
  return (
    <div
      className={`h-12 flex place-items-center font-mono text-xl rounded-lg 
      border-2 px-3 bg-gray-100 ${className}`}
    >
      {number}
    </div>
  )
}

export default SingleStat
