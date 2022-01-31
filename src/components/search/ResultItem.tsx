import React from 'react'
import { NextRouter } from 'next/router'

import RouteCard from '../ui/RouteCard'
import { ClimbAlgoliaType } from '../../js/types'
interface ResultItemType extends ClimbAlgoliaType {
  router: NextRouter
}
const ResultItem = (props: ResultItemType): JSX.Element => {
  const { name, objectID, fa, yds, type, safety, router } = props
  const url = `/climbs/${objectID}`
  return (
    <div className='p-4' onClick={async () => await router.push(url)}>
      <RouteCard routeName={name} type={type} yds={yds} safety={safety} fa={fa} />
    </div>
  )
}

export default ResultItem
