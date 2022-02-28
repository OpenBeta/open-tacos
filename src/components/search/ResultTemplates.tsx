import React from 'react'
import { NextRouter } from 'next/router'

import RouteCard from '../ui/RouteCard'
import { TypesenseDocumentType } from '../../js/types'

interface ClimbTemplateType extends TypesenseDocumentType {
  router: NextRouter
}

interface SearchByNameTemplateProps {
  groupKey: string []
  hits: any[]
}
/**
 * Template for rendering indiviual search result item
 * @param param0
 * @returns
 */
export const SearchByNameTemplate = ({ groupKey, hits }: SearchByNameTemplateProps): JSX.Element => {
  return (
    <div className='hover:bg-white'>
      <div className='uppercase'>{groupKey}</div>
      <div>
        {hits.map(
          ({ document }) => <ClimbTemplate key={document.id} {...document} />
        )}
      </div>
    </div>
  )
}

/**
 * How to render individual climb in search results
 */
const ClimbTemplate = (props: ClimbTemplateType): JSX.Element => {
  const { climbName, climbId, fa, disciplines, grade, safety, router } = props
  const url = `/climbs/${climbId}`
  return (
    <div className='p-4' onClick={async () => await router.push(url)}>
      <RouteCard
        routeName={climbName}
        type={disciplineArrayToObj(disciplines)}
        yds={grade}
        safety={safety}
        fa={fa}
      />
    </div>
  )
}

const disciplineArrayToObj = (types: string[]): any => {
  const z = {}
  for (const t of types) {
    z[t] = true
  }
  return z
}
