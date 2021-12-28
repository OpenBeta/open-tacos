import React from 'react'
import Chip from './Chip'

function RouteTypeChips ({ type }) {
  return (
    <div className='inline'>
      {type && type.trad && <Chip type='trad' />}
      {type && type.sport && <Chip type='sport' />}
      {type && type.tr && <Chip type='tr' />}
      {type && type.boulder && <Chip type='boulder' />}
    </div>
  )
}

export default RouteTypeChips
