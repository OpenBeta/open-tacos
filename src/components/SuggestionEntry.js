import React from 'react'
import { LabelMap } from './TypeLabels'

export default function SuggestionEntry ({ suggestion }) {
  const { name, yds, type, meta_parent_sector: parentSector, fa } = suggestion
  const faTxt = fa && fa.toUpperCase() === 'UNKNOWN' ? 'FA unknown' : fa
  return (
    <div className='suggestion'>
      <div className='suggestion-fa'>{faTxt}</div>
      <div className='suggestion-main'>
        <div>
          <strong>{name}</strong> {yds}
        </div>
        <LabelMap types={type} />
      </div>
      <div className='suggestion-location'>{parentSector}</div>
    </div>
  )
}
