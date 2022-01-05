import React from 'react'
import { NextRouter } from 'next/router'

import RouteCard from '../ui/RouteCard'
import { Climb } from '../../js/types'
interface ResultItemType extends Climb {
  router: NextRouter
}
const ResultItem = (props: ResultItemType): JSX.Element => {
  const { name, fa, yds, type, safety, metadata, router } = props
  const url = `/climbs/${metadata.climb_id}`
  return (
    <div className='p-4' onClick={async () => await router.push(url)}>
      <RouteCard routeName={name} type={type} yds={yds} safety={safety} fa={fa} />
    </div>
  )
}

export default ResultItem
