import React from 'react'

const ChipType = {
  sport: 'border-indigo-400',
  trad: 'border-red-700',
  boulder: 'border-green-700',
  tr: 'border-yellow-400'
}

function Chip ({ type }) {
  return (
    <span
      className={`font-extralight font-mono rounded-sm py-1 mr-4 px-2 text-xs uppercase border-2 ${ChipType[type]}`}
    >
      {type}
    </span>
  )
}

export default Chip
